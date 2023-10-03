import Install from "./components/Install";
import Home from "./components/Home";
import FileUpload from "./components/UploadFile";
//0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512 deployed Contract
function App() {
  if (window.ethereum) {
    return <FileUpload />;
  } else {
    return <Install />;
  }
}

export default App;
