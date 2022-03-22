import { ethers } from 'hardhat';
import { Contract, ContractFactory } from 'ethers';

async function main() {
  const Greeter: ContractFactory = await ethers.getContractFactory('Greeter');
  const greeter: Contract = await Greeter.deploy('Hello, Hardhat!');

  await greeter.deployed();

  console.log('Greeter deployed to:', greeter.address);
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exitCode = 1;
  });
