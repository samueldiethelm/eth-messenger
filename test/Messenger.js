// We import Chai to use its asserting functions here.
const { expect } = require("chai");

// `describe` is a Mocha function that allows you to organize your tests. It's
// not actually needed, but having your tests organized makes debugging them
// easier. All Mocha functions are available in the global scope.

// `describe` receives the name of a section of your test suite, and a callback.
// The callback must define the tests of that section. This callback can't be
// an async function.
describe("Messenger contract", function () {
  // Mocha has four functions that let you hook into the the test runner's
  // lifecyle. These are: `before`, `beforeEach`, `after`, `afterEach`.

  // They're very useful to setup the environment for tests, and to clean it
  // up after they run.

  // A common pattern is to declare some variables, and assign them in the
  // `before` and `beforeEach` callbacks.

  let Messenger;
  let hardhatToken;
  let owner;
  let addr1;
  let addrs;

  // `beforeEach` will run before each test, re-deploying the contract every
  // time. It receives a callback, which can be async.
  beforeEach(async function () {
    // Get the ContractFactory and Signers here.
    Messenger = await ethers.getContractFactory("Messenger");
    [owner, addr1, ...addrs] = await ethers.getSigners();

    // To deploy our contract, we just have to call Token.deploy() and await
    // for it to be deployed(), which happens onces its transaction has been
    // mined.
    hardhatToken = await Messenger.deploy();
  });

  describe("Messages", function(){
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