import hre from "hardhat"



async function main() {
    
    
    const [owner, user1, user2] = await hre.ethers.getSigners();

    const amountNairaApproved = hre.ethers.parseUnits("100000000", 18)
    const amountUsdtApproved = hre.ethers.parseUnits("10", 18)

    const naira = await hre.ethers.getContractFactory("NairaToken");
    const nairaTx = await naira.deploy(owner);

    const usdt = await hre.ethers.getContractFactory("UsdtToken");
    const usdtTx = await usdt.deploy(owner)

    const swap = await hre.ethers.getContractFactory("SwapToken");
    const swapTx  = await swap.deploy(nairaTx, usdtTx)


    const amountMintToContct = await hre.ethers.parseUnits("1000000000000", 18)
    const amountMintToUser = await hre.ethers.parseUnits("100000000000000", 18)

    const swapTokenInstance = await hre.ethers.getContractAt("SwapToken", swapTx);
    const nairaTokenInstance = await hre.ethers.getContractAt("NairaToken", nairaTx);
    const usdtTokenInstance = await hre.ethers.getContractAt("UsdtToken", usdtTx);


    //starting of scripting

    console.log("###### Minting naira and usdt for the swapToken contract #######");


    const mintNairaToContract = await nairaTokenInstance.connect(owner).mint(swapTx.getAddress(), amountMintToContct);

    mintNairaToContract.wait();

    console.log({"NairaContractMint": mintNairaToContract});

    const mintUsdtToContract = await usdtTokenInstance.connect(owner).mint(swapTx.getAddress(), amountMintToContct);

    mintUsdtToContract.wait();

    console.log({"UsdtContractMint reciept": mintUsdtToContract});

    console.log("####### getting usdt and naira balance of the contract");


    const Usdt = await usdtTokenInstance.balanceOf(swapTx.getAddress());

    const Naira = await nairaTokenInstance.balanceOf(swapTx.getAddress());



    console.log({
    "USDT" : Usdt.toString(),
    "NAIRA": Naira.toString()
    })


    console.log("####### Minting Naira User1 ########");


    const user1NairaMinting = await nairaTokenInstance.connect(owner).mint(user1.address, amountMintToUser);

    user1NairaMinting.wait();

    console.log({"UsdtUserMint reciept": user1NairaMinting});

    console.log("######### getting user1 balance after minting ###########");

    const user1NairaBal = await nairaTokenInstance.connect(user1).balanceOf(user1.address);
    const user1UsdtBal = await usdtTokenInstance.connect(user1).balanceOf(user1.address);

    console.log({"user1 Naira balance before swap": user1NairaBal.toString(), "user1 Usdt balance before swap": user1UsdtBal.toString()});


    
    
    console.log("###### Approving contract to spend Naira from User1 #######");

    const nairaApprovalTx = await nairaTokenInstance.connect(user1).approve(swapTx.getAddress(), amountNairaApproved);

    nairaApprovalTx.wait();

    console.log("###### Swapping Naira for Usdt");

    await swapTokenInstance.connect(user1).swapNairaToUsdt(user1.address, 10000000);


    const user1UsdtBlc = await usdtTokenInstance.connect(user1).balanceOf(user1.address);
    const user1NairaBlc = await nairaTokenInstance.connect(user1).balanceOf(user1.address);

    console.log({"User1 Naira balance after swap": user1NairaBlc.toString(), "User1 Usdt balance after swap":  user1UsdtBlc.toString()});




    console.log("###### Approving contract to spend Usdt from User1 #######");

    const usdtApprovalTx = await usdtTokenInstance.connect(user1).approve(swapTx.getAddress(), amountUsdtApproved);

    usdtApprovalTx.wait();

    console.log("###### Swapping usdt for Naira");

    await swapTokenInstance.connect(user1).swapUsdtToNaira(user1.address, 5);


    const user1UsdtBl = await usdtTokenInstance.connect(user1).balanceOf(user1.address);
    const user1NairaBl = await nairaTokenInstance.connect(user1).balanceOf(user1.address);

    console.log({"User1 Naira balance after swap": user1NairaBl.toString(), "User1 Usdt balance after swap":  user1UsdtBl.toString()})





    








    
}

main().catch((error) => {
    console.error(error);
    process.exitCode = 1
})
