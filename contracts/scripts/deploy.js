const { ethers } = require("hardhat");
require("dotenv").config({ path: "../.env" });

async function main() {
  const [deployer] = await ethers.getSigners();
  console.log("Deploying contracts with the account:", deployer.address);

  const balance = await ethers.provider.getBalance(deployer.address);
  console.log("Account balance:", ethers.formatEther(balance), "ETH");

  // FHEVote does not require an oracle; use placeholder if not set (for compatibility with other projects)
  const FHEOracleAddress = process.env.VITE_FHE_ORACLE_ADDRESS || '0x0000000000000000000000000000000000000000';
  if (!process.env.VITE_FHE_ORACLE_ADDRESS) {
    console.warn("VITE_FHE_ORACLE_ADDRESS not set; proceeding with placeholder 0x00..00");
  }
  console.log("FHE Oracle (unused placeholder):", FHEOracleAddress);

  try {
    // Deploy FHEVote contract
    console.log("\nDeploying FHEVote contract...");
    const FHEVote = await ethers.getContractFactory("FHEVote");
    const fheVote = await FHEVote.deploy();
    await fheVote.waitForDeployment();

    const fheVoteAddress = await fheVote.getAddress();
    console.log("FHEVote contract deployed to:", fheVoteAddress);

    // Verify deployment
    console.log("\nVerifying deployment...");
    const owner = await fheVote.owner();
    const totalVotes = await fheVote.getTotalVotes();
    
    console.log("Contract owner:", owner);
    console.log("Initial vote count:", totalVotes.toString());

    // Create a sample vote for testing (best-effort)
    let voteId = 0n;
    try {
      console.log("\nCreating sample vote...");
      const sampleOptions = ["Option A", "Option B", "Option C"];
      const tx = await fheVote.createVote(
        "Sample FHE Vote",
        "This is a sample vote to demonstrate the FHE voting system",
        sampleOptions,
        24 * 60 * 60 // 24 hours
      );
      await tx.wait();
      voteId = await fheVote.getTotalVotes();
      console.log("Sample vote created with ID:", voteId.toString());
    } catch (e) {
      console.warn("Sample vote creation skipped due to error:", e?.message || e);
    }

    // Save deployment info
    const deploymentInfo = {
      network: "sepolia",
      fheVoteAddress: fheVoteAddress,
      fheOracleAddress: FHEOracleAddress,
      deployer: deployer.address,
      deploymentTime: new Date().toISOString(),
      blockNumber: await ethers.provider.getBlockNumber(),
      sampleVoteId: voteId ? voteId.toString() : null
    };

    console.log("\n=== Deployment Summary ===");
    console.log("Network: Sepolia Testnet");
    console.log("FHEVote Contract:", fheVoteAddress);
    console.log("FHE Oracle:", FHEOracleAddress);
    console.log("Deployer:", deployer.address);
    if (voteId) {
      console.log("Sample Vote ID:", voteId.toString());
    } else {
      console.log("Sample Vote ID: (skipped)");
    }
    console.log("Deployment Time:", deploymentInfo.deploymentTime);

    console.log("\n=== Next Steps ===");
    console.log("1. Update your root .env file with the contract address:");
    console.log(`   VITE_CONTRACT_ADDRESS="${fheVoteAddress}"`);
    console.log("2. Start the frontend dev server:");
    console.log("   cd ../frontend && npm run dev");
    console.log("3. Open http://localhost:3000 and connect MetaMask");

    console.log("\n=== Contract ABI ===");
    console.log("The contract ABI is available in artifacts/contracts/src/FHEVote.sol/FHEVote.json");

  } catch (error) {
    console.error("Deployment failed:", error);
    process.exit(1);
  }
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
