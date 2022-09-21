import { useState } from 'react';
import FormData from 'form-data';
import axios from 'axios'; 

async function getHashArray (wallet_address) {
  const response = await axios.post('http://localhost:3002/wallet', {address: `${wallet_address}`})
  return response
}

// Sign function. Call update method of contract and push up user address + array

function Manager() {

  const [file, setFile] = useState()
  const [myipfsHash, setIPFSHASH] = useState('')
 

  const handleFile=async (fileToHandle) =>{

    

    console.log('starting')

    // initialize the form data
    const formData = new FormData()

    // append the file form data to 
    formData.append("file", fileToHandle)
    for (const value of formData.values()) {
        console.log(value, 'here')
    }

    // call the keys from .env

    const API_KEY = process.env.REACT_APP_API_KEY
    const API_SECRET = process.env.REACT_APP_API_SECRET

    // the endpoint needed to upload the file
    const url =  `https://api.pinata.cloud/pinning/pinFileToIPFS`

    const response = await axios.post(
      url,
      formData,
      {
          maxContentLength: "Infinity",
          headers: {
              "Content-Type": `multipart/form-data;boundary=${formData._boundary}`, 
              'pinata_api_key': API_KEY,
              'pinata_secret_api_key': API_SECRET
          }
      }
  )

  console.log(response)

  // Send response.data.ipfsHash to backend server

  // Creative new div element with new hash

  // get the hash
  setIPFSHASH(response.data.IpfsHash)

  }

  

  return (
    <div id='file-manager' className='file-manager-container'>
      <div><h2><span>Welcome - </span><span className='wallet-text'></span></h2></div>
      <div className="file-manager-upload-form">
        <label class="custom-file-upload">
          <input type="file" onChange={(event)=>setFile(event.target.files[0])}/>
          Upload
        </label>
        <button className='pin-button' onClick={()=>handleFile(file)}>Pin</button>
        <button className='pin-button'>Sign</button>
      </div>
      <div className='file-manager-hash-list-container'>
        <h2>Existing Hash List</h2>
        <div className='file-manager-hash-list'>
          <div className='file-manager-hash-list-item'><a target={'_blank'} href='#'>NUMBER1</a></div>
          <div className='file-manager-hash-list-item'><a target={'_blank'} href='#'>NUMBER2</a></div>
          <div className='file-manager-hash-list-item'><a target={'_blank'} href='#'>NUMBER3</a></div>
        </div>
      </div>
    </div>
  );
}

export default Manager;