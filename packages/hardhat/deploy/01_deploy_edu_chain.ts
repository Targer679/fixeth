import { HardhatRuntimeEnvironment } from "hardhat/types";
import { DeployFunction } from "hardhat-deploy/types";

const func: DeployFunction = async function (hre: HardhatRuntimeEnvironment) {
  const { deployer } = await hre.getNamedAccounts();
  const { deploy } = hre.deployments;

  console.log("Deploying EduChainDiploma contract...");

  const eduChain = await deploy("EduChainDiploma", {
    from: deployer,
    args: [],
    log: true,
    autoMine: true,
  });

  console.log("🎓 EduChainDiploma deployed to:", eduChain.address);
  
  // Добавляем deployer'а как issuer для тестирования
  const contract = await hre.ethers.getContractAt("EduChainDiploma", eduChain.address);
  const tx = await contract.addIssuer(deployer);
  await tx.wait();
  console.log("✅ Deployer added as issuer:", deployer);
};

export default func;
func.tags = ["EduChainDiploma"];