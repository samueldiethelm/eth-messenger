pragma solidity ^0.7.0;

contract Messenger {

    struct Message{
        address sender;
        bytes32 messageHash;
    }

    // Mapping containing received messages
    mapping(address => Message[]) messageHashes;

    // Mapping of messages hashes
    mapping(bytes32 => string) messages;

    event MessageSent(address indexed _from, address indexed _to);

    function send(address to, string calldata message) external {
        emit MessageSent(msg.sender, to);

        bytes32 messageHash = keccak256(abi.encodePacked(message));
        messages[messageHash] = message;

        messageHashes[to].push( Message(
            msg.sender,
            messageHash
        ) );
    }

    function messageContent(address account, uint x) external view returns (string memory) {
        return messages[messageHashes[account][x].messageHash];
    }

    function messageSender(address account, uint x) external view returns (address) {
        return messageHashes[account][x].sender;
    }

    function messagesReceived(address account) external view returns (uint) {
        return messageHashes[account].length;
    }

}