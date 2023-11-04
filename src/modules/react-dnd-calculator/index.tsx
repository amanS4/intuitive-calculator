import React, { useState, useCallback, ReactNode } from "react";
import { DndProvider, useDrop, useDrag } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import { v4 as uuidv4 } from "uuid";
import { ECustomNodeTypes } from "../../constants";

interface BoxData {
  id: string;
  type: ECustomNodeTypes;
  value?: number | string;
}

interface Connection {
  fromId: string;
  toId: string;
  operation: string;
}

interface CanvasState {
  boxes: BoxData[];
  connections: Connection[];
  history: CanvasState[];
}

interface BoxProps {
  type: string;
  accept: string[];
  onDrop: (item: any) => void;
  children: ReactNode;
}

interface DragItem {
  type: ECustomNodeTypes;
  value?: number | string;
}

const Box: React.FC<BoxProps> = ({ accept, onDrop, children }) => {
  const [{ isOver }, drop] = useDrop({
    accept,
    drop: onDrop,
    collect: (monitor) => ({
      isOver: !!monitor.isOver(),
    }),
  });

  return (
    <div
      ref={drop}
      style={{
        border: isOver ? "2px solid blue" : "1px solid black",
        padding: "10px",
        margin: "10px",
      }}
    >
      {children}
    </div>
  );
};

const Draggable: React.FC<DragItem> = ({ type, value }) => {
  const [{ isDragging }, drag] = useDrag({
    type: type,
    item: { type, value },
    collect: (monitor) => ({
      isDragging: !!monitor.isDragging(),
    }),
  });

  return (
    <div ref={drag} style={{ opacity: isDragging ? 0.5 : 1 }}>
      {type === ECustomNodeTypes.input ? (
        <input type="number" defaultValue={value as number} />
      ) : (
        value
      )}
    </div>
  );
};

const Canvas: React.FC = () => {
  const [result, setResult] = useState<number | null>(null);
  const [canvasState, setCanvasState] = useState<CanvasState>({
    boxes: [],
    connections: [],
    history: [],
  });
  const [selectedBox, setSelectedBox] = useState<string | null>(null);

  const handleDrop = useCallback((item: DragItem) => {
    // Generate a unique ID for the new box
    const id = uuidv4();
    // Add the new box to the state
    setCanvasState((prev) => {
      const newBox: BoxData = { id, type: item.type, value: item.value };
      const newBoxes = [...prev.boxes, newBox];
      const newHistory = [...prev.history, prev]; // Save the current state to history for undo

      return {
        ...prev,
        boxes: newBoxes,
        history: newHistory,
      };
    });
  }, []);

  const handleConnect = useCallback(
    (fromId: string, toId: string, operation: string) => {
      // Add the new connection to the state
      setCanvasState((prev) => {
        const newConnection: Connection = { fromId, toId, operation };
        return {
          ...prev,
          connections: [...prev.connections, newConnection],
          history: [...prev.history, prev], // Save the current state to history for undo
        };
      });
    },
    []
  );

  const handleBoxClick = useCallback(
    (id: string) => {
      if (selectedBox && selectedBox !== id) {
        // If a box is already selected, create a connection with a default operation
        handleConnect(selectedBox, id, "+");
        setSelectedBox(null); // Reset the selected box
      } else {
        // Select the box
        setSelectedBox(id);
      }
    },
    [selectedBox, handleConnect]
  );

  const handleUndo = useCallback(() => {
    // Undo the last action by reverting to the previous state
    setCanvasState((prev) => {
      const history = prev.history;
      const lastState = history[history.length - 1] || prev;
      return {
        ...lastState,
        history: history.slice(0, history.length - 1), // Remove the last state from history
      };
    });
  }, []);

  const calculateResult = useCallback(() => {
    let currentResult = 0;
    let currentOperation: string | null = null;

    canvasState.boxes.forEach((box) => {
      if (box.type === ECustomNodeTypes.input) {
        const value = box.value as number;
        switch (currentOperation) {
          case "+":
            currentResult += value;
            break;
          case "-":
            currentResult -= value;
            break;
          case "*":
            currentResult *= value;
            break;
          case "/":
            currentResult /= value;
            break;
          default:
            currentResult = value;
        }
      } else if (box.type === "operation") {
        currentOperation = box.value as string;
      }
    });

    setResult(currentResult);
  }, [canvasState]);

  return (
    <DndProvider backend={HTML5Backend}>
      <div></div>
      <div>
        <Draggable type={ECustomNodeTypes.input} value={5} />
        <Draggable type={ECustomNodeTypes.operation} value="+" />
        <Draggable type={ECustomNodeTypes.operation} value="-" />
        <Draggable type={ECustomNodeTypes.operation} value="*" />
        <Draggable type={ECustomNodeTypes.operation} value="/" />
        <button onClick={calculateResult}>Calculate Result</button>
      </div>
      <Box
        type="canvas"
        accept={[ECustomNodeTypes.input, ECustomNodeTypes.operation]}
        onDrop={handleDrop}
      >
        {canvasState.boxes.map((box) => (
          <div key={box.id} onClick={() => handleBoxClick(box.id)}>
            <Draggable type={box.type} value={box.value} />
          </div>
        ))}
      </Box>
      <Box type="result" accept={[]} onDrop={() => {}}>
        {result !== null
          ? `Result: ${result}`
          : "Drop operations and inputs here"}
      </Box>
      <button onClick={handleUndo}>Undo</button>
    </DndProvider>
  );
};

export default Canvas;
