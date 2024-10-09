import { HardhatRuntimeEnvironment } from "hardhat/types";
import { DeployFunction } from "hardhat-deploy/types";
import { Contract } from "ethers";

/**
 * Deploys a contract named "StakingContract" using the deployer account and
 * constructor arguments set to the deployer address
 *
 * @param hre HardhatRuntimeEnvironment object.
 */
const deployStakingContract: DeployFunction = async function (hre: HardhatRuntimeEnvironment) {
  /*
    On localhost, the deployer account is the one that comes with Hardhat, which is already funded.

    When deploying to live networks (e.g `yarn deploy --network sepolia`), the deployer account
    should have sufficient balance to pay for the gas fees for contract creation.

    You can generate a random account with `yarn generate` which will fill DEPLOYER_PRIVATE_KEY
    with a random private key in the .env file (then used on hardhat.config.ts)
    You can run the `yarn account` command to check your balance in every network.
  */
  const { deployer, wallet } = await hre.getNamedAccounts();
  const { deploy, get } = hre.deployments;
  const jwrTokenContract = await get("JWRToken");
  const rewardRate = 1;

  await deploy("StakingContract", {
    from: deployer,
    // Contract constructor arguments
    args: [jwrTokenContract.address, rewardRate, wallet],
    log: true,
    // autoMine: can be passed to the deploy function to make the deployment process faster on local networks by
    // automatically mining the contract deployment transaction. There is no effect on live networks.
    autoMine: true,
  });

  // Get the deployed contract to interact with it after deploying.
  const stakingContract = await hre.ethers.getContract<Contract>("StakingContract", deployer);
  const stakingToken = await stakingContract.stakingToken();
  console.log("👋 Staking for ", stakingToken, " contract deployed!");
};

export default deployStakingContract;

// Tags are useful if you have multiple deploy files and only want to run one of them.
// e.g. yarn deploy --tags StakingContract
deployStakingContract.tags = ["StakingContract"];
