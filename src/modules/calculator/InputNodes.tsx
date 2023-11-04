import { ChangeEvent, UIEvent, useId } from "react";
import { NodeProps, Position, useNodeId, useReactFlow } from "reactflow";
import CustomHandle from "./CustomHandle";
import { calculateResult } from "../../utils";
import { ECustomNodeTypes } from "../../constants";
export const InputNode: React.FC<NodeProps> = (props) => {
  const { data } = props;
  const reactFlowInstance = useReactFlow();
  const nodeId = useNodeId();
  const id = useId();
  const handleInputChange = (event: ChangeEvent<HTMLInputElement>) => {
    const edges = reactFlowInstance.getEdges();
    reactFlowInstance.setNodes((currentNodes) => {
      const updatedNodes = currentNodes.map((node) =>
        node.id === nodeId ? { ...node, data: event.target.value } : node
      );
      return calculateResult(reactFlowInstance, updatedNodes, edges);
    });
  };

  const onScrollDisableChange = (e: UIEvent<HTMLInputElement>) => {
    e.preventDefault();
  };

  return (
    <div className={`${ECustomNodeTypes.input}-node`}>
      <CustomHandle
        id={id + ECustomNodeTypes.input}
        type="target"
        position={Position.Left}
        isConnectable={1}
        excludedTargetNodeType={[ECustomNodeTypes.input]}
      />
      <input
        onScroll={onScrollDisableChange}
        type="number"
        value={data}
        onChange={handleInputChange}
      />
      <CustomHandle
        id={id + "jj" + ECustomNodeTypes.input}
        type="source"
        position={Position.Right}
        isConnectable={1}
        excludedTargetNodeType={[ECustomNodeTypes.input]}
      />
    </div>
  );
};
