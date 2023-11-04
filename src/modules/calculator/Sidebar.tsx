import React, { useState } from "react";
import { useReactFlow } from "reactflow";
import { ECustomNodeTypes, EDragDropZones } from "../../constants";

const Sidebar: React.FC = () => {
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
    reactFlowInstance.addNodes(newNode);
  };

  const resetHandler = () => {
    reactFlowInstance.setNodes([]);
    reactFlowInstance.addEdges([]);
  };

  return (
    <div className={`sidebar ${!expandedMenu ? "smaller" : ""}`}>
      <button
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
        onDragStart={(event) => onDragStart(event, ECustomNodeTypes.operation)}
        draggable
      >
        <img src="/operation-sample.png" alt="Add Input By Drag" width={100} />
      </div>
      <div
        className="draggable-btns"
        onDragStart={(event) => onDragStart(event, ECustomNodeTypes.result)}
        draggable
      >
        <img src="/result-sample.png" alt="Add Input By Drag" width={100} />
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
    </div>
  );
};

export default Sidebar;
