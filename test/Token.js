const { expect } = require("chai");
const {ethers} = require("hardhat");

describe("Token contract", function() {
  it("部署应将Token的总供应分配给所有人", async function() {
    const [owner] = await ethers.getSigners();
    const Token = await ethers.getContractFactory("Token");
    const hardhatToken = await Token.deploy();

    const ownerBalance = await hardhatToken.balanceOf(owner.address);
    console.log('ownerBalance', ownerBalance.toString(), (await hardhatToken.totalSupply()).toString())
    expect(await hardhatToken.totalSupply()).to.equal(ownerBalance);
  });
});