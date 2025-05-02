// scripts/getWeth.js
const { ethers, deployments, getNamedAccounts, network } = require("hardhat");

const AMOUNT = ethers.parseEther("0.02"); // 0.02 WETH

async function getWeth() {
  const { deployer } = await getNamedAccounts();
  const signer = await ethers.getSigner(deployer);

  const iWeth = await ethers.getContractAt(
    "IWeth",
    "0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2",
    signer,
  );

  const tx = await iWeth.deposit({ value: AMOUNT });
  await tx.wait(1);
  const wethBalance = await iWeth.balanceOf(signer.address);
  console.log(`Got ${wethBalance.toString()} WETH`);
}

module.exports = { getWeth, AMOUNT };
