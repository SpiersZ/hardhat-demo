const { expect } = require("chai");
const {ethers} = require("hardhat");

describe("Token contract", function() {
  it("test", async function () {
    const [owner] = await ethers.getSigners();
    const Token = await ethers.getContractFactory("Offering");
    const hardhatToken = await Token.deploy();

    await hardhatToken.deployed();


    const ownerBalance = await hardhatToken.balanceOf(owner.address);

    await hardhatToken.network.provider.request({
      method: "hardhat_impersonateAccount",
      params: ["0x23FCB0E1DDbC821Bd26D5429BA13B7D5c96C0DE0"]
    });
    const signer = await ethers.getSigner("0x23FCB0E1DDbC821Bd26D5429BA13B7D5c96C0DE0")
    signer.sendTransaction(

    )
    expect(await hardhatToken.totalSupply()).to.equal(ownerBalance);
  });
});