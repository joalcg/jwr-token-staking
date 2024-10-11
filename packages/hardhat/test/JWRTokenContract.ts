// Final test file

// import { expect } from "chai";
// import { ethers } from "hardhat";
// import { JWRToken } from "../typechain-types";

// describe("JWRToken", function () {
//   // We define a fixture to reuse the same setup in every test.

//   let jwrTokenContract: JWRToken;
//   before(async () => {
//     const [owner] = await ethers.getSigners();
//     const jwrTokenContractFactory = await ethers.getContractFactory("JWRToken");
//     jwrTokenContract = (await jwrTokenContractFactory.deploy(owner.address)) as JWRToken;
//     await jwrTokenContract.waitForDeployment();
//   });

//   describe("Deployment", function () {
//     it("Should have the right symbol on deploy", async function () {
//       expect(await jwrTokenContract.symbol()).to.equal("JWR");
//     });
//     it("Should have the right name on deploy", async function () {
//       expect(await jwrTokenContract.name()).to.equal("JWR Token");
//     });
//   });
// });

import { expect } from "chai";
import { ethers } from "hardhat";
import { JWRToken, StakingContract } from "../typechain-types";

describe("JWRToken and StakingContract", function () {
  let jwrToken: JWRToken;
  let stakingContract: StakingContract;
  let owner: any;
  let addr1: any;
  let addr2: any;

  const initialSupply = ethers.parseEther("10000");
  const rewardRate = 1; // 1 token per second per staked token
  
  beforeEach(async function () {
    [owner, addr1, addr2] = await ethers.getSigners();
  
    const JWRTokenFactory = await ethers.getContractFactory("JWRToken");
    jwrToken = await JWRTokenFactory.deploy(initialSupply, owner);
    await jwrToken.deployed();
  
    const StakingContractFactory = await ethers.getContractFactory("StakingContract");
    stakingContract = await StakingContractFactory.deploy(jwrToken.getAddress(), rewardRate, owner);
    await stakingContract.deployed();
  
    // Transfer some tokens to addr1 for staking
    await jwrToken.transfer(addr1.address, ethers.parseEther("1000")); 
    await jwrToken.connect(addr1).approve(stakingContract.getAddress(), ethers.parseEther("1000")); 
  });

  describe("JWRToken", function () {
    it("Should deploy with correct initial supply", async function () {
      expect(await jwrToken.totalSupply()).to.equal(initialSupply);
    });

    it("Should allow transfers between accounts", async function () {
      await jwrToken.transfer(addr1.address, ethers.parseEther("50"));
      expect(await jwrToken.balanceOf(addr1.address)).to.equal(ethers.parseEther("1050")); // 1000 initial + 50 transferred
    });

    it("Should fail if sender doesn't have enough tokens", async function () {
      await expect(jwrToken.connect(addr2).transfer(addr1.address, ethers.parseEther("1"))).to.be.revertedWith("Insufficient funds");
    });

    it("Should update allowances on approval", async function () {
      await jwrToken.approve(addr1.address, ethers.parseEther("100"));
      expect(await jwrToken.allowance(owner.address, addr1.address)).to.equal(ethers.parseEther("100"));
    });

    it("Should transfer tokens using transferFrom", async function () {
      await jwrToken.approve(addr1.address, ethers.parseEther("100"));
      await jwrToken.connect(addr1).transferFrom(owner.address, addr2.address, ethers.parseEther("50"));
      expect(await jwrToken.balanceOf(addr2.address)).to.equal(ethers.parseEther("50"));
    });
  });

  describe("StakingContract", function () {
    it("Should allow staking tokens", async function () {
      await stakingContract.connect(addr1).stake(ethers.parseEther("100")); 
      const [stakeAmount, ] = await stakingContract.connect(addr1).getStake(); 
      expect(stakeAmount).to.equal(ethers.parseEther("100")); 
    });

    it("Should not allow staking 0 tokens", async function () {
      await expect(stakingContract.connect(addr1).stake(0)).to.be.revertedWith("Cannot stake 0 tokens"); 
    });

    it("Should allow withdrawing staked tokens", async function () {
      await stakingContract.connect(addr1).stake(ethers.parseEther("100"));
      await stakingContract.connect(addr1).withdraw(ethers.parseEther("50"));
      const [stakeAmount, ] = await stakingContract.connect(addr1 ).getStake(); 
      expect(stakeAmount).to.equal(ethers.parseEther("50")); 
    });
  });
});