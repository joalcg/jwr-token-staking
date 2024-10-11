import { expect } from "chai";
import { ethers } from "hardhat";
import { JWRToken, StakingContract } from "../typechain-types";

let jwrToken: JWRToken;
let stakingContract: StakingContract;
let owner: any;
let addr1: any;
let addr2: any;

const initialSupply = ethers.parseEther("10000");
const rewardRate = 1;

beforeEach(async function () {
  [owner, addr1, addr2] = await ethers.getSigners();

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

describe("JWRToken", function () {
  it("Should deploy with correct initial supply", async function () {
    expect(await jwrToken.totalSupply()).to.equal(initialSupply);
  });

  it("Should allow transfers between accounts", async function () {
    await jwrToken.transfer(addr1.address, ethers.parseEther("50"));
    expect(await jwrToken.balanceOf(addr1.address)).to.equal(ethers.parseEther("1050")); // 1000 initial + 50 transferred
  });

  it("Should fail if sender doesn't have enough tokens", async function () {
    await expect(jwrToken.connect(addr2).transfer(addr1.address, ethers.parseEther("1"))).to.be.revertedWith(
      "Insufficient funds",
    );
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
