// We import Chai to use its asserting functions here.
const { expect } = require("chai");

describe("Messenger contract", function () {

  let Messenger;
  let hardhatToken;
  let owner;
  let addr1;
  let addrs;

  before(async function () {
    // Get the ContractFactory and Signers
    Messenger = await ethers.getContractFactory("Messenger");
    [owner, addr1, ...addrs] = await ethers.getSigners();

    hardhatToken = await Messenger.deploy();
  });

  describe("Messages", function(){
    it("Should reject empty messages", async function(){
      await expect(
        hardhatToken.send(addr1.address, "")
      ).to.be.revertedWith("Message cannot be empty.");
    });
    it("Should send message between accounts", async function() {

      // addr1 should have zero messages:
      addr1MessagesReceived = await hardhatToken.messagesReceived(addr1.address);
      expect(addr1MessagesReceived).to.equal(0);

      await hardhatToken.send(addr1.address, "Hello World");

      // addr1 should now have 1 message:
      addr1MessagesReceived = await hardhatToken.messagesReceived(addr1.address);
      expect(addr1MessagesReceived).to.equal(1);

      // message content should be equal:
      receivedMessage = await hardhatToken.messageContent(addr1.address,0);
      expect(receivedMessage).to.equal("Hello World");

      // owner should have zero messages:
      ownerMessagesReceived = await hardhatToken.messagesReceived(owner.address);
      expect(ownerMessagesReceived).to.equal(0);

      await hardhatToken.connect(addr1).send(owner.address, "Foo Bar");

      // owner should now have 1 message:
      ownerMessagesReceived = await hardhatToken.messagesReceived(owner.address);
      expect(ownerMessagesReceived).to.equal(1);

      // message content should be equal:
      receivedMessage = await hardhatToken.messageContent(owner.address,0);
      expect(receivedMessage).to.equal("Foo Bar");
      
    });
  });

});