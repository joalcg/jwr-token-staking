import { expect } from "chai";
import { ethers } from "hardhat";
import { JWRToken, StakingContract } from "../typechain-types";

let jwrToken: JWRToken;
let stakingContract: StakingContract;
let owner: any;
let addr1: any;

const initialSupply = ethers.parseEther("10000");
const rewardRate = 1;

beforeEach(async function () {
  [owner, addr1] = await ethers.getSigners();

  const JWRTokenFactory = await ethers.getContractFactory("JWRToken");
  jwrToken = (await JWRTokenFactory.deploy(initialSupply, owner.address)) as JWRToken;

  const StakingContractFactory = await ethers.getContractFactory("StakingContract");
  stakingContract = (await StakingContractFactory.deploy(
    jwrToken.getAddress(),
    rewardRate,
    owner.address,
  )) as StakingContract;

  // Transfer some tokens to addr1 for staking
  await jwrToken.transfer(addr1.address, ethers.parseEther("1000"));
  await jwrToken.connect(addr1).approve(stakingContract.getAddress(), ethers.parseEther("1000"));
});

describe("StakingContract", function () {
  it("Should allow staking tokens", async function () {
    await stakingContract.connect(addr1).stake(ethers.parseEther("100"));
    const [stakeAmount] = await stakingContract.connect(addr1).getStake();
    expect(stakeAmount).to.equal(ethers.parseEther("100"));
  });

  it("Should not allow staking 0 tokens", async function () {
    await expect(stakingContract.connect(addr1).stake(0)).to.be.revertedWith("Cannot stake 0 tokens");
  });

  it("Should allow withdrawing staked tokens", async function () {
    await stakingContract.connect(addr1).stake(ethers.parseEther("100"));
    await stakingContract.connect(addr1).withdraw(ethers.parseEther("50"));
    const [stakeAmount] = await stakingContract.connect(addr1).getStake();
    expect(stakeAmount).to.equal(ethers.parseEther("50"));
  });
});
