import { useCallback, useEffect, useRef, useState } from "react";
import { Edge, Node, useReactFlow } from "reactflow";
import { useOutsideClickCallback } from "../../utils/custom-hooks";
import { toast } from "react-toastify";
import { ELocalStorageKeys } from "../../constants";

type TSavedData =
  | {
      name: string;
      edges: Edge[];
      nodes: Node[];
    }[]
  | null;

export default function SaveCanvasButton() {
  const reactFlowInstance = useReactFlow();
  const ref = useRef(null);
  const [inputVal, setInputVal] = useState("");
  const [showSaveInput, setShowSaveInput] = useState(false);
  const [savedData, setSavedData] = useState<TSavedData>(null);

  const outSideClickCallback = useCallback(
    () => setShowSaveInput(false),
    [setShowSaveInput]
  );

  useOutsideClickCallback(ref, outSideClickCallback);

  const saveHandler = () => {
    if (!inputVal?.length) {
      toast("Please enter a valid name.");
      return;
    }
    const [edges, nodes] = [
      reactFlowInstance.getEdges(),
      reactFlowInstance.getNodes(),
    ];
    const newCanvasData = {
      name: inputVal,
      nodes,
      edges,
    };
    let parsedData = {} as Record<"data", any>;
    const existingSavedData = localStorage.getItem(
      ELocalStorageKeys.savedCanvas
    );
    if (existingSavedData) {
      parsedData = JSON.parse(existingSavedData);
      if (parsedData?.data?.some((data: any) => data.name.includes(inputVal))) {
        toast("Name already exists, please save with a new one.");
        return;
      }
      const newData = {
        data: [newCanvasData, ...parsedData.data].slice(0, 5),
      };
      localStorage.setItem(
        ELocalStorageKeys.savedCanvas,
        JSON.stringify(newData)
      );
      setSavedData(newData.data);
    } else {
      localStorage.setItem(
        ELocalStorageKeys.savedCanvas,
        JSON.stringify({ data: [newCanvasData] })
      );
      setSavedData([newCanvasData]);
    }
  };

  const loadHandler = (edges: Edge[], nodes: Node[]) => {
    reactFlowInstance.setEdges(edges);
    reactFlowInstance.setNodes(nodes);
  };

  useEffect(() => {
    const existingSavedData = localStorage.getItem(
      ELocalStorageKeys.savedCanvas
    );
    if (existingSavedData) {
      const { data } = JSON.parse(existingSavedData);
      setSavedData(data);
    }
  }, []);

  return (
    <div
      ref={ref}
      className={`save-button-custom ${showSaveInput ? "input-visible" : ""}`}
    >
      <button
        className="diskbtn"
        onClick={() => setShowSaveInput(true)}
        type="button"
      >
        <img width={20} src="/diskette.png" alt="" />
      </button>
      <span className="title">Save as</span>
      <button className="cross-btn" onClick={outSideClickCallback}>
        <img alt="close" src="/cross.png" width={22} />
      </button>
      <div className="input-container">
        <input
          value={inputVal}
          onChange={(e) => setInputVal(e.target.value)}
          type="text"
        />
        <button className="button-custom-styles" onClick={saveHandler}>
          Save
        </button>
        <ol className="saved-list">
          <span>Saved Boards</span>
          <hr />
          {savedData?.map((saveData) => (
            <li
              key={saveData?.name}
              style={{
                display: "flex",
                justifyContent: "space-between",
              }}
            >
              <span
                style={{
                  maxWidth: "150px",
                  whiteSpace: "break-spaces",
                  textOverflow: "ellipsis",
                  wordWrap: "break-word",
                }}
              >
                {saveData?.name}
              </span>
              <button
                onClick={() => loadHandler(saveData.edges, saveData.nodes)}
              >
                Load Data
              </button>
            </li>
          ))}
        </ol>
      </div>
    </div>
  );
}
