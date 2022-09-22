import { useState } from 'react';
import FormData from 'form-data';
import axios from 'axios'; 
import { useMoralis, useWeb3Contract  } from "react-moralis";

async function getHashArray (wallet_address) {
  const response = await axios.post('http://localhost:3002/wallet', {address: `${wallet_address}`})
  return response
}

function getCookieValue (cookieName) {
  let cookieValue = document.cookie
  .split('; ')
  .find((row) => row.startsWith(`${cookieName}=`))
  ?.split('=')[1];

  return cookieValue
}

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
  let hashElementList = document.querySelector('.file-manager-hash-list')
  let latestHash = response.data.IpfsHash
  let userAddress = getCookieValue('walletAddress')
  let secondResponse = await axios.post('http://localhost:3002/wallet', {wallet_address: `${userAddress}`})

  if (secondResponse.data.message === 'false' || secondResponse.data.message === false) {
    let newArray = []
    newArray.push(latestHash)
    axios.post('http://localhost:3002/register',
    {wallet_address: `${userAddress}`,
    file_hash_array: newArray})

    let outerElement = document.createElement("div")
    outerElement.classList.add('file-manager-hash-list-item')

    let innerElement = document.createElement("a")
    innerElement.target = `{'_blank'}`
    innerElement.href = '#'
    innerElement.innerHTML = newArray[0]

    outerElement.append(innerElement)
    hashElementList.append(outerElement)

  } else {
    let oldHashArray = secondResponse.data.file_hash_array
    oldHashArray.push(latestHash)
    let deletedResponse = await axios.delete(`http://localhost:3002/${secondResponse.data.__id}`)

    if (deletedResponse) {
      axios.post('http://localhost:3002/register',
      {wallet_address: `${userAddress}`,
      file_hash_array: oldHashArray})
    
    }

    // Creative new div element with new hash
    for (let i = 0; i < oldHashArray.length; i++) {
      let outerElement = document.createElement("div")
      outerElement.classList.add('file-manager-hash-list-item')

      let innerElement = document.createElement("a")
      innerElement.target = `{'_blank'}`
      innerElement.href = '#'
      innerElement.innerHTML = oldHashArray[i]

      outerElement.append(innerElement)
      hashElementList.append(outerElement)
    }
  }

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
        <a href='#signContract' className='pin-button' style={{maxWidth: '200px'}}>Sign?</a>
      </div>
      <div className='file-manager-hash-list-container'>
        <h2>Existing Hash List</h2>
        <div className='file-manager-hash-list'>
        </div>
      </div>
    </div>
  );
}

export default Manager;