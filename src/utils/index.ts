import { Edge, Node, ReactFlowInstance } from "reactflow";
import { ECustomNodeTypes } from "../constants";

export const performOperation = (
  left: number,
  right: number,
  operator: string
) => {
  switch (operator) {
    case "+":
      return left + right;
    case "-":
      return left - right;
    case "*":
      return left * right;
    case "/":
      return right !== 0 ? left / right : "Denied";
    default:
      return 0;
  }
};

export const calculateResult = (
  reactFlowInstance: ReactFlowInstance<any, any>,
  nodesog: Node[],
  edges: Edge[]
) => {
  // Create a map for node values
  const nodeValues = new Map();
  const nodes = Array.from(nodesog);

  // Initial pass to assign input values
  nodes.forEach((node) => {
    if (node.type === ECustomNodeTypes.input) {
      nodeValues.set(node.id, parseFloat(node.data));
    }
  });

  // Iterate over the edges to perform calculations
  edges.forEach((edge) => {
    const sourceNode = nodes.find((node) => node.id === edge.source);
    const targetNode = nodes.find((node) => node.id === edge.target);

    // Check if we have a valid operation
    if (
      sourceNode &&
      targetNode &&
      targetNode.type === ECustomNodeTypes.operation
    ) {
      const sourceValue = nodeValues.get(sourceNode.id) || 0;
      const operationValue = targetNode.data;

      // Apply the operation to the next input node in the chain
      edges.forEach((nextEdge) => {
        if (nextEdge.source === targetNode.id) {
          const nextInputNode = nodes.find(
            (node) => node.id === nextEdge.target
          );
          if (nextInputNode && nextInputNode.type === ECustomNodeTypes.input) {
            const nextInputValue = nodeValues.get(nextInputNode.id) || 0;
            nodeValues.set(
              nextInputNode.id,
              performOperation(sourceValue, nextInputValue, operationValue)
            );
          }
        }
      });
    }
  });

  // Final pass to assign result values
  nodes.forEach((node) => {
    if (node.type === ECustomNodeTypes.result) {
      const inputNodesConnected = edges
        .filter((edge) => edge.target === node.id)
        .map((edge) => edge.source);
      let result = 0;
      inputNodesConnected.forEach((inputNodeId) => {
        const latestValue = nodeValues.get(inputNodeId);
        result =
          typeof latestValue === "string"
            ? nodeValues.get(inputNodeId)
            : result + latestValue;
      });
      node.data = result;
    }
  });
  reactFlowInstance.setNodes(nodes);
  return nodes;
};
