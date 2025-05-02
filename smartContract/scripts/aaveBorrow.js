// scripts/aaveBorrow.js
const { getWeth, AMOUNT } = require("./getWeth");
const { getNamedAccounts, ethers } = require("hardhat");

async function main() {
  await getWeth();

  const { deployer } = await getNamedAccounts();
  const signer = await ethers.getSigner(deployer);
  const lendingPool = await getLendingPool(signer);
  console.log(`Lending Pool Address:`, lendingPool.target);

  const wethTokenAddress = "0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2";

  //approve
  await approveERC20(wethTokenAddress, lendingPool.target, AMOUNT, signer);
  console.log("Depositing...");
  // deposit
  await lendingPool.deposit(wethTokenAddress, AMOUNT, deployer, 0);
  console.log("Deposited!");
}

async function getLendingPool(account) {
  const lendingPoolAddressesProvider = await ethers.getContractAt(
    "ILendingPoolAddressesProvider",
    "0xB53C1a33016B2DC2fF3653530bfF1848a515c8c5",
    account,
  );
  const lendingPoolAddress = await lendingPoolAddressesProvider.getLendingPool()
  const lendingPool = await ethers.getContractAt("ILendingPool", lendingPoolAddress, account)

  return lendingPool
}

async function approveERC20(erc20Address, spenderAddress, amountToSpend, account) {
  const erc20Token = await ethers.getContractAt(
    "IERC20",
    erc20Address,
    account,
  );
  const tx = await erc20Token.approve(spenderAddress, amountToSpend)
  await tx.wait(1)
  console.log("Approved!")
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
