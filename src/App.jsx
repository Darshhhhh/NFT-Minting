import Install from "./components/Install";
import Home from "./components/Home";
import FileUpload from "./components/UploadFile";
//0xCC92Ab43dF7ff5A8112a5cEBadEAA6aBf94E45d9 deployed Contract
function App() {
  if (window.ethereum) {
    return <FileUpload />;
  } else {
    return <Install />;
  }
}

export default App;
