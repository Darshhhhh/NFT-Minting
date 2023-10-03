import Install from "./components/Install";
import Home from "./components/Home";
import FileUpload from "./components/UploadFile";
//0x09180239838a3ce0c4e1e8afa699670218d55262 deployed Contract
function App() {
  if (window.ethereum) {
    return <FileUpload />;
  } else {
    return <Install />;
  }
}

export default App;
