import { useCallback } from "react";
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
  const reactFlowInstance = useReactFlow();

  const onDragOver = useCallback((event: any) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = "move";
  }, []);

  const onDrop = useCallback(
    (event: any) => {
      event.preventDefault();
      const position = reactFlowInstance.project({
        x: event.clientX,
        y: event.clientY,
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
    [reactFlowInstance, setNodes]
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

  return (
    <section style={{ height: "100vh", width: "100vw", background: "#fff" }}>
      <Sidebar />
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
