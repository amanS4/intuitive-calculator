import { useCallback, useEffect, useRef, useState } from "react";
import ReactFlow, {
  addEdge,
  useNodesState,
  useEdgesState,
  Connection,
  Edge,
  Node,
  useReactFlow,
} from "reactflow";
import "reactflow/dist/style.css";
import Sidebar from "./Sidebar";
import { calculateResult } from "../../utils";
import { EDragDropZones, NodeTypes } from "../../constants";
import SaveCanvasButton from "./SaveCanvasButton";

const CalculatorCavasParent = () => {
  const [nodes, setNodes, onNodesChange] = useNodesState([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);
  const [canvasHistory, setCanvasHistory] = useState([
    { nodes: [] as Node[], edges: [] as Edge[] },
  ]);
  const reactFlowWrapper = useRef<HTMLDivElement>();
  const reactFlowInstance = useReactFlow();

  const onDragOver = useCallback((event: any) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = "move";
  }, []);

  const onDrop = useCallback(
    (event: any) => {
      event.preventDefault();
      const reactFlowBounds =
        reactFlowWrapper?.current?.getBoundingClientRect();
      const position = reactFlowInstance.project({
        x: event.clientX - (reactFlowBounds ? reactFlowBounds?.left : 0),
        y: event.clientY - (reactFlowBounds ? reactFlowBounds?.top : 0),
      });
      const type = event.dataTransfer.getData(EDragDropZones.canvas);
      const newNode = {
        id: Date.now().toString(),
        type,
        position,
        data: type === "operation" ? "+" : 0,
      };

      setNodes((nds) => nds.concat(newNode));
    },
    [reactFlowInstance, setNodes, reactFlowWrapper]
  );

  const recalculateResults = useCallback(
    (currentNodes: Node[]) => {
      let updatedNodes = null;
      setEdges((edges) => {
        updatedNodes = calculateResult(reactFlowInstance, currentNodes, edges);
        return [...edges];
      });
      if (updatedNodes) {
        setNodes(updatedNodes);
      }
    },
    [setEdges, setNodes, reactFlowInstance]
  );

  const onConnect = useCallback(
    (params: Edge | Connection) => {
      setEdges((eds) => addEdge(params, eds));
      setNodes((currentNodes) => {
        recalculateResults(currentNodes);
        return currentNodes;
      });
    },
    [setNodes, setEdges, recalculateResults]
  );

  const handleUndo = useCallback(() => {
    const lastChange = canvasHistory.at(-2);
    if (!lastChange) return;
    setEdges(lastChange.edges);
    setNodes(lastChange.nodes);
    setCanvasHistory((lastHistory) => lastHistory.slice(0, -1));
  }, [canvasHistory, setEdges, setNodes]);

  const updateHistory = useCallback(
    (newNodes: Node[], newEdges: Edge[]) => {
      setCanvasHistory((lastHistory) => {
        const lastHistoryElms = lastHistory.at(-1);
        return lastHistoryElms?.edges?.length !== newEdges.length ||
          lastHistoryElms?.nodes?.length !== newNodes.length
          ? [...lastHistory, { nodes: newNodes, edges: newEdges }]
          : lastHistory;
      });
    },
    [setCanvasHistory]
  );

  useEffect(() => {
    if (nodes.length || edges.length) updateHistory(nodes, edges);
  }, [nodes.length, edges.length, updateHistory]);

  return (
    <section
      ref={reactFlowWrapper}
      style={{ height: "100vh", width: "100vw", background: "#fff" }}
    >
      <Sidebar handleUndo={handleUndo} setCanvasHistory={setCanvasHistory} />
      <ReactFlow
        onDragOver={onDragOver}
        onDrop={onDrop}
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        nodeTypes={NodeTypes}
        fitView
        selectionOnDrag
        panOnScroll
        className="touchdevice-flow"
        connectOnClick
      />
      <SaveCanvasButton />
    </section>
  );
};

export default CalculatorCavasParent;
