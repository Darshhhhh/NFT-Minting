import axios from "axios";
import { useState } from "react";
import { Contract, Signer, ethers } from "ethers";
import FiredGuys from "../artifacts/contracts/MyNFT.sol/FiredGuys.json";

const JWT = `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySW5mb3JtYXRpb24iOnsiaWQiOiI5NDc5MjYzZi1hMWVlLTRiMzUtOTNkOS0wNmQzZTNmZTRmYTgiLCJlbWFpbCI6ImRhcnNoc2hhaDc0NzJAZ21haWwuY29tIiwiZW1haWxfdmVyaWZpZWQiOnRydWUsInBpbl9wb2xpY3kiOnsicmVnaW9ucyI6W3siaWQiOiJGUkExIiwiZGVzaXJlZFJlcGxpY2F0aW9uQ291bnQiOjF9LHsiaWQiOiJOWUMxIiwiZGVzaXJlZFJlcGxpY2F0aW9uQ291bnQiOjF9XSwidmVyc2lvbiI6MX0sIm1mYV9lbmFibGVkIjpmYWxzZSwic3RhdHVzIjoiQUNUSVZFIn0sImF1dGhlbnRpY2F0aW9uVHlwZSI6InNjb3BlZEtleSIsInNjb3BlZEtleUtleSI6IjBjZTllZmVmMWM1ZTJlOGY0YzNhIiwic2NvcGVkS2V5U2VjcmV0IjoiZmZiZGFhZDNmZjliZGQ1ZmJlZTUxYWQxZGIxYjk4NmI0YjRmMmFkMzViZDU3ZjIzNmY0NWRiYzlhMmJhMzU0YyIsImlhdCI6MTY5NjMxNTE1MH0.jVLgTGw2gBSG1brIIal97FKBlDbJq6_AKA_Rnv5m9eE`;
const contractAddress = "0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512";

const provider = new ethers.providers.Web3Provider(window.ethereum);

// get the end user
const signer = provider.getSigner();

// get the smart contract
const contract = new ethers.Contract(contractAddress, FiredGuys.abi, signer);
const contentId = "QmNknrvav9RQWV4ARe8YAdmLknHWDKeK9VaCLUizSvqQYz";
const metadataURI = `${contentId}/${tokenId}.json`;
const FileUpload = () => {
  const [balance, setBalance] = useState();
  const [ShowData, setShowData] = useState([]);
  console.log(ShowData);
  const getBalance = async () => {
    const [account] = await window.ethereum.request({
      method: "eth_requestAccounts",
    });
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const balance = await provider.getBalance(account);
    setBalance(ethers.utils.formatEther(balance));
  };
  const [selectedFile, setSelectedFile] = useState();
  const changeHandler = (event) => {
    setSelectedFile(event.target.files[0]);
  };

  const handleSubmission = async () => {
    const formData = new FormData();

    formData.append("file", selectedFile);

    const metadata = JSON.stringify({
      name: selectedFile.name,
    });
    formData.append("pinataMetadata", metadata);

    const options = JSON.stringify({
      cidVersion: 0,
    });
    formData.append("pinataOptions", options);

    try {
      const res = await axios.post(
        "https://api.pinata.cloud/pinning/pinFileToIPFS",
        formData,
        {
          maxBodyLength: "Infinity",
          headers: {
            "Content-Type": `multipart/form-data; boundary=${formData._boundary}`,
            Authorization: JWT,
          },
        }
      );
      console.log(res.data);
      mintToken();
    } catch (error) {
      console.log(error);
    }
  };

  const getData = () => {
    const options = {
      method: "GET",
      headers: {
        accept: "application/json",
        authorization:
          "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySW5mb3JtYXRpb24iOnsiaWQiOiI5NDc5MjYzZi1hMWVlLTRiMzUtOTNkOS0wNmQzZTNmZTRmYTgiLCJlbWFpbCI6ImRhcnNoc2hhaDc0NzJAZ21haWwuY29tIiwiZW1haWxfdmVyaWZpZWQiOnRydWUsInBpbl9wb2xpY3kiOnsicmVnaW9ucyI6W3siaWQiOiJGUkExIiwiZGVzaXJlZFJlcGxpY2F0aW9uQ291bnQiOjF9LHsiaWQiOiJOWUMxIiwiZGVzaXJlZFJlcGxpY2F0aW9uQ291bnQiOjF9XSwidmVyc2lvbiI6MX0sIm1mYV9lbmFibGVkIjpmYWxzZSwic3RhdHVzIjoiQUNUSVZFIn0sImF1dGhlbnRpY2F0aW9uVHlwZSI6InNjb3BlZEtleSIsInNjb3BlZEtleUtleSI6IjBjZTllZmVmMWM1ZTJlOGY0YzNhIiwic2NvcGVkS2V5U2VjcmV0IjoiZmZiZGFhZDNmZjliZGQ1ZmJlZTUxYWQxZGIxYjk4NmI0YjRmMmFkMzViZDU3ZjIzNmY0NWRiYzlhMmJhMzU0YyIsImlhdCI6MTY5NjMxNTE1MH0.jVLgTGw2gBSG1brIIal97FKBlDbJq6_AKA_Rnv5m9eE",
      },
    };

    fetch("https://api.pinata.cloud/data/pinList", options)
      .then((response) => response.json())
      .then((response) => setShowData(response.rows))
      .catch((err) => console.error(err));
  };

  //Faccing ISue here.....
  const mintToken = async () => {
    const connection = contract.connect(signer);
    const addr = connection.address;
    const result = await contract.payToMint(addr, metadataURI, {
      value: ethers.utils.parseEther("0.05"),
    });

    await result.wait();
  };

  return (
    <>
      <div className="card">
        <div className="card-body">
          <h1>Check logs and network Tab</h1>
          <h5 className="card-title">Your Balance: {balance}</h5>
          <button className="btn btn-success me-4" onClick={() => getBalance()}>
            Show My Balance
          </button>
          <button onClick={() => getData()} className="btn btn-danger">
            Show Uploads
          </button>
        </div>
      </div>
      <br />
      <label class="form-label">Choose File</label>
      <input type="file" onChange={changeHandler} className="me-2" />
      <button className="btn btn-success" onClick={handleSubmission}>
        Submit
      </button>
      <br />
      {ShowData?.map((e, index) => {
        <div className="text-black">
          <p className="text-black">{index + 1}</p>;
          <p>IPFS HASh : {e?.ipfs_pin_hash}</p>;
        </div>;
      })}
      {/* <button className="btn btn-primary" onClick={mintToken}>
        Mint
      </button> */}
    </>
  );
};

export default FileUpload;
