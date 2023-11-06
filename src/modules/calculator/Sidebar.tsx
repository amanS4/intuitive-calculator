import React, { Dispatch, SetStateAction, useState } from "react";
import { Edge, Node, useReactFlow } from "reactflow";
import { ECustomNodeTypes, EDragDropZones } from "../../constants";

interface ISidebar {
  handleUndo: () => void;
  setCanvasHistory: Dispatch<
    SetStateAction<
      {
        nodes: Node[];
        edges: Edge[];
      }[]
    >
  >;
}
const Sidebar: React.FC<ISidebar> = (props) => {
  const { handleUndo, setCanvasHistory } = props;
  const reactFlowInstance = useReactFlow();
  const [expandedMenu, setExpandedMenu] = useState(false);

  const onDragStart = (event: React.DragEvent, nodeType: string) => {
    event.dataTransfer.setData(EDragDropZones.canvas, nodeType);
    event.dataTransfer.effectAllowed = "move";
  };

  const addNode = (type: string) => {
    const newNode = {
      id: Date.now().toString(),
      type,
      position: reactFlowInstance.project({
        x: 220,
        y: 100 + reactFlowInstance.getNodes().length * 10,
      }),
      data: type === "operation" ? "+" : 0,
    };
    reactFlowInstance.setNodes((oldNodes) => {
      return [...oldNodes, newNode];
    });
  };

  const resetHandler = () => {
    reactFlowInstance.setNodes([]);
    reactFlowInstance.setEdges([]);
    setCanvasHistory([{ nodes: [], edges: [] }]);
  };

  return (
    <div className={`sidebar ${!expandedMenu ? "smaller" : ""}`}>
      <button
        style={
          expandedMenu
            ? { position: "absolute", right: "-3.4em", top: "0.5em" }
            : {}
        }
        onClick={() => setExpandedMenu((val) => !val)}
        className="sidebar-btn"
      >
        <img
          src={expandedMenu ? "/back.png" : "/hamburger.png"}
          height={30}
          width={30}
          alt=""
        />
      </button>
      <div className="draggables-container">
        <div className="sidebar-text">Add by Drag & Drop</div>
        <div
          className="draggable-btns"
          onDragStart={(event) => onDragStart(event, ECustomNodeTypes.input)}
          draggable
        >
          <img src="/input-sample.png" alt="Add Input By Drag" width={100} />
        </div>
        <div
          className="draggable-btns"
          onDragStart={(event) =>
            onDragStart(event, ECustomNodeTypes.operation)
          }
          draggable
        >
          <img
            src="/operation-sample.png"
            alt="Add Input By Drag"
            width={100}
          />
        </div>
        <div
          className="draggable-btns"
          onDragStart={(event) => onDragStart(event, ECustomNodeTypes.result)}
          draggable
        >
          <img src="/result-sample.png" alt="Add Input By Drag" width={100} />
        </div>
      </div>
      <div className="sidebar-text"> Add by Click</div>
      <button
        className="button-custom-styles"
        onClick={() => addNode(ECustomNodeTypes.input)}
      >
        Add Input
      </button>
      <button
        className="button-custom-styles"
        onClick={() => addNode(ECustomNodeTypes.operation)}
      >
        Add Operation
      </button>
      <button
        className="button-custom-styles"
        onClick={() => addNode(ECustomNodeTypes.result)}
      >
        Add Result
      </button>
      <hr />
      <button className="button-custom-styles" onClick={resetHandler}>
        Reset
      </button>
      <button className="button-custom-styles" onClick={handleUndo}>
        Undo
      </button>
    </div>
  );
};

export default Sidebar;
