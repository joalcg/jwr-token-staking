import { expect } from "chai";
import { ethers } from "hardhat";
import { JWRToken } from "../typechain-types";

describe("JWRToken", function () {
  // We define a fixture to reuse the same setup in every test.

  let jwrTokenContract: JWRToken;
  before(async () => {
    const [owner] = await ethers.getSigners();
    const jwrTokenContractFactory = await ethers.getContractFactory("JWRToken");
    jwrTokenContract = (await jwrTokenContractFactory.deploy(owner.address)) as JWRToken;
    await jwrTokenContract.waitForDeployment();
  });

  describe("Deployment", function () {
    it("Should have the right symbol on deploy", async function () {
      expect(await jwrTokenContract.symbol()).to.equal("JWR");
    });
    it("Should have the right name on deploy", async function () {
      expect(await jwrTokenContract.name()).to.equal("JWR Token");
    });
  });
});
