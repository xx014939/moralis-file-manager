pragma solidity 0.4.24;

contract FileManager {
    mapping(uint256 => User) users;

    struct User {
        uint256 id;
        //other attributes
        address userAddress;
        string[] data;
    }

    uint counter = 0;

    // Create a new user.
    function newUser() public {
        users[counter].id = counter;
        users[counter].userAddress = msg.sender;
        counter++;
    }

    // Pushed a piece of data to a user
    function addData(uint256 _id, string _data) public {
        users[_id].data.push(_data);
    }

    // Pushed a piece of data to a user
    function addHash(string _data) public {
        for (uint i = 0; i < counter; i++) {
            if (users[i].userAddress == msg.sender) {
                users[i].data.push(_data);
            }
        }
    }

        // Returns the amount of strings in a User's data array
    function getContents() public view returns (address, string) {
        for (uint i = 0; i < counter; i++) {
            if (users[i].userAddress == msg.sender) {
                return (users[i].userAddress, users[i].data[(users[i].data.length - 1)]);    
            }
        }      
    }
}