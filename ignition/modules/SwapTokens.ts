import { buildModule } from "@nomicfoundation/hardhat-ignition/modules";


const SwapTokenModule = buildModule("SwapTokenModule", (m) => {
  const nairaToken = m.contract("NairaToken", ["0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266"]);

  const usdtToken = m.contract("UsdtToken", ["0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266"]);

  const tokenSwap = m.contract("SwapToken", [nairaToken, usdtToken]);



  return { tokenSwap };
});

export default SwapTokenModule;



