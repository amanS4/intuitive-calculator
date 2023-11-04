import { ChangeEvent, useId } from "react";
import { NodeProps, Position, useNodeId, useReactFlow } from "reactflow";
import CustomHandle from "./CustomHandle";
import { calculateResult } from "../../utils";
import { ECustomNodeTypes } from "../../constants";

export const OperationNode: React.FC<NodeProps> = (props) => {
  const { data } = props;
  const reactFlowInstance = useReactFlow();
  const nodeId = useNodeId();
  const id = useId();

  const handleSelectChange = (event: ChangeEvent<HTMLSelectElement>) => {
    const edges = reactFlowInstance.getEdges();
    reactFlowInstance.setNodes((currentNodes) => {
      const updatedNodes = currentNodes.map((node) =>
        node.id === nodeId ? { ...node, data: event.target.value } : node
      );
      return calculateResult(reactFlowInstance, updatedNodes, edges);
    });
  };

  return (
    <div className="operation-node">
      <select value={data} onChange={handleSelectChange}>
        <option value="+">+</option>
        <option value="-">-</option>
        <option value="*">*</option>
        <option value="/">/</option>
      </select>
      <CustomHandle
        id={id + ECustomNodeTypes.operation}
        type="target"
        position={Position.Left}
        isConnectable={1}
      />
      <CustomHandle
        id={id + "hh" + ECustomNodeTypes.operation}
        type="source"
        position={Position.Right}
        isConnectable={1}
        excludedTargetNodeType={[ECustomNodeTypes.result]}
      />
    </div>
  );
};
