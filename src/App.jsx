import Install from "./components/Install";
import Home from "./components/Home";
import FileUpload from "./components/UploadFile";
//0x7b00C59c9E5F28067F3e49760010eF5A66C6aa28 deployed Contract
function App() {
  if (window.ethereum) {
    return <FileUpload />;
  } else {
    return <Install />;
  }
}

export default App;
