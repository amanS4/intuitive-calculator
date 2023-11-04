import { InputNode } from "../modules/calculator/InputNodes";
import { OperationNode } from "../modules/calculator/OperationNode";
import { ResultNode } from "../modules/calculator/ResultNode";

export enum ECustomNodeTypes {
  input = "input",
  operation = "operation",
  result = "result",
}

export const NodeTypes = {
  [ECustomNodeTypes.input]: InputNode,
  [ECustomNodeTypes.operation]: OperationNode,
  [ECustomNodeTypes.result]: ResultNode,
};

export enum EDragDropZones {
  canvas = "canvas",
}

// Using random strings, to prevent data becoming information in local storage, usually I encrypt it as well
export enum ELocalStorageKeys {
  savedCanvas = "gibberTripper",
}
