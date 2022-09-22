import { useState } from 'react';
import FormData from 'form-data';
import axios from 'axios'; 

async function getHashArray (wallet_address) {
  const response = await axios.post('http://localhost:3002/wallet', {address: `${wallet_address}`})
  return response
}

// Sign function. Call update method of contract and push up user address + array

const signHash = () => {
  const { data, error, runContractFunction, isFetching, isLoading } =
  useWeb3Contract({
    abi: usdcEthPoolAbi,
    contractAddress: usdcEthPoolAddress,
    functionName: "observe",
    params: {
      secondsAgos: [0, 10],
    },
  });
}

// Contract Hash --> 0xA068328C00e400D9D0B8B4E9D20e1a64aE8AcD97

// MOVE THIS COMPONENT INTO REGISTER.JS, SO YOU DON'T HAVE TO CALL ALL THE MORALIS STUFF AGAIN
// SIGN HASH SHOULD BE ONCLICK FOR THE SIGN BUTTON. 
// YOU'RE CALLING THE NEWUSER METHOD, FOLLOWED BY THE ADDHASH METHOD


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
  let latestHash = response.data.IpfsHash
  let secondResponse = await axios.post('http://localhost:3002/wallet', {wallet_address: '0x755f830e1a13b63a7d5c5550a0e02d9228c8db74'})

  let oldHashArray = secondResponse.data.file_hash_array
  oldHashArray.push(latestHash)

  axios.delete(`http://localhost:3002/${secondResponse.data.__id}`)

  axios.post('http://localhost:3002/register',
  {wallet_address: '0x755f830e1a13b63a7d5c5550a0e02d9228c8db74',
  file_hash_array: oldHashArray})




  // Creative new div element with new hash
  let hashElementList = document.querySelector('.file-manager-hash-list')
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
        </div>
      </div>
    </div>
  );
}

export default Manager;