import { ReactFlowProvider } from "reactflow";
import CalculatorCavasParent from "./modules/calculator/CalculatorCavasParent";
import "./App.css";
import "reactflow/dist/style.css";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
function App() {
  return (
    <main>
      <ToastContainer position={toast.POSITION.BOTTOM_RIGHT} />
      <ReactFlowProvider>
        <CalculatorCavasParent />
      </ReactFlowProvider>
    </main>
  );
}

export default App;
