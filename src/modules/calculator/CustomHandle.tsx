import React, { useMemo } from "react";
import {
  getConnectedEdges,
  Handle,
  useNodeId,
  useStore,
  Node,
  Edge,
  HandleType,
  Position,
  Connection,
} from "reactflow";

interface StoreState {
  nodeInternals: Map<string, Node>;
  edges: Edge[];
}

interface CustomHandleProps {
  type: HandleType;
  position: Position;
  isConnectable:
    | boolean
    | number
    | ((params: { node: Node; connectedEdges: Edge[] }) => boolean);
  id: string;
  excludedTargetNodeType?: string[];
  // Include other props from Handle component as needed
}

const selector = (s: StoreState) => ({
  nodeInternals: s.nodeInternals,
  edges: s.edges,
});

const CustomHandle: React.FC<CustomHandleProps> = (props) => {
  const { isConnectable, id } = props;
  const { excludedTargetNodeType, ...handleProps } = props;
  const { nodeInternals, edges } = useStore(selector);
  const nodeId = useNodeId();

  const isHandleConnectable = useMemo(() => {
    if (typeof isConnectable === "function") {
      const node = nodeId && nodeInternals.get(nodeId);
      if (!node) return false;

      const connectedEdges = getConnectedEdges([node], edges);

      return isConnectable({ node, connectedEdges });
    }

    if (typeof isConnectable === "number") {
      const node = nodeId && nodeInternals.get(nodeId);
      if (!node) return false;
      let shouldConnect = true;
      const connectedEdges = getConnectedEdges([node], edges);
      const handleConnections = connectedEdges.filter((edge) => {
        if (
          (edge.source === nodeId && edge.sourceHandle === id) ||
          (edge.target === nodeId && edge.targetHandle === id)
        ) {
          const targetNode = nodeInternals.get(edge.target);
          if (targetNode && targetNode.type === excludedTargetNodeType) {
            shouldConnect = false;
            return false;
          }
          return true;
        }
      });
      console.log(shouldConnect && handleConnections.length < isConnectable);
      return shouldConnect && handleConnections.length < isConnectable;
    }

    return isConnectable;
  }, [nodeInternals, edges, nodeId, isConnectable, id, excludedTargetNodeType]);

  const isValidConnection = (connection: Connection) => {
    return excludedTargetNodeType
      ? !excludedTargetNodeType?.some((name) =>
          connection.targetHandle?.includes(name)
        )
      : true;
  };

  return (
    <Handle
      {...handleProps}
      isConnectable={isHandleConnectable}
      isValidConnection={isValidConnection}
    ></Handle>
  );
};

export default CustomHandle;
