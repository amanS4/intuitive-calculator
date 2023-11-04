import React, { useId } from "react";
import { NodeProps, Position } from "reactflow";
import CustomHandle from "./CustomHandle";
import { ECustomNodeTypes } from "../../constants";

export const ResultNode: React.FC<NodeProps> = ({ data }) => {
  const id = useId();
  return (
    <div className="result-node">
      Result: {data}
      <CustomHandle
        id={id + ECustomNodeTypes.result}
        type="target"
        position={Position.Left}
        isConnectable={1}
        excludedTargetNodeType={[ECustomNodeTypes.operation]}
      />
    </div>
  );
};
