import { useMoralis, useWeb3Contract  } from "react-moralis";

function getCookieValue (cookieName) {
    let cookieValue = document.cookie
    .split('; ')
    .find((row) => row.startsWith(`${cookieName}=`))
    ?.split('=')[1];
  
    return cookieValue
  }
  

function SignContract () {
      
    const { data, error, runContractFunction, isFetching, isLoading } =
    useWeb3Contract();

    // Minimise this
    const ABI = [
        {
            "constant": false,
            "inputs": [
                {
                    "name": "_id",
                    "type": "uint256"
                },
                {
                    "name": "_data",
                    "type": "string"
                }
            ],
            "name": "addData",
            "outputs": [],
            "payable": false,
            "stateMutability": "nonpayable",
            "type": "function"
        },
        {
            "constant": false,
            "inputs": [
                {
                    "name": "_data",
                    "type": "string"
                }
            ],
            "name": "addHash",
            "outputs": [],
            "payable": false,
            "stateMutability": "nonpayable",
            "type": "function"
        },
        {
            "constant": false,
            "inputs": [],
            "name": "newUser",
            "outputs": [],
            "payable": false,
            "stateMutability": "nonpayable",
            "type": "function"
        },
        {
            "constant": true,
            "inputs": [],
            "name": "doesUserExist",
            "outputs": [
                {
                    "name": "",
                    "type": "bool"
                }
            ],
            "payable": false,
            "stateMutability": "view",
            "type": "function"
        },
        {
            "constant": true,
            "inputs": [],
            "name": "getContents",
            "outputs": [
                {
                    "name": "",
                    "type": "address"
                },
                {
                    "name": "",
                    "type": "string"
                }
            ],
            "payable": false,
            "stateMutability": "view",
            "type": "function"
        }
    ]

    const newUser = {
    abi: ABI,
    contractAddress: '0xA068328C00e400D9D0B8B4E9D20e1a64aE8AcD97',
    functionName: "newUser",
    params: {

    },
    };

    const doesUserExist = {
    abi: ABI,
    contractAddress: '0xA068328C00e400D9D0B8B4E9D20e1a64aE8AcD97',
    functionName: "doesUserExist",
    params: {

    },
    };

    return (
        <div id="signContract" className="sign-contract-container">
            <div className="sign-contract-form">
                <button className="pin-button" onClick={ async () => {
                    console.log('running')
                    const response = await runContractFunction({ params: doesUserExist })
                    console.log(response)
                    document.cookie = `userExists=${response}`
                }}>Authenticate</button>
                <input type="text" id="latestHash" style={{marginTop: '20px', padding: '5px'}}></input>
                <button className="pin-button" onClick={async () => {
                    let currentCookieValue = getCookieValue('userExists')
                    console.log(currentCookieValue)
                    if (currentCookieValue === true || currentCookieValue === 'true') {
                        let latestHash = document.getElementById('latestHash').value
                        let addHash = {
                            abi: ABI,
                            contractAddress: '0xA068328C00e400D9D0B8B4E9D20e1a64aE8AcD97',
                            functionName: "addHash",
                            params: {
                                _data: `${latestHash}`,
                            },
                        };
                        const secondResponse = await runContractFunction({ params: addHash })
                        console.log(secondResponse)
                    } else {
                        runContractFunction({ params: newUser })
                        let latestHash = document.getElementById('latestHash').value
                        let addHash = {
                            abi: ABI,
                            contractAddress: '0xA068328C00e400D9D0B8B4E9D20e1a64aE8AcD97',
                            functionName: "addHash",
                            params: {
                                _data: `${latestHash}`,
                            },
                        };
                        runContractFunction({ params: addHash })
                    }
                }}>Add Hash</button>
            </div>
        </div>
    )
}

export default SignContract;