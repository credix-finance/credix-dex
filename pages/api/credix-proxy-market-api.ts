import { Connection, PublicKey, Transaction } from "@solana/web3.js";
import { AnchorWallet } from "@solana/wallet-adapter-react";
import { loadCredixPermissionedMarket } from "./credix-proxy-market";
import {
  getAssociatedBaseTokenAddressPK,
  getGatekeeperNetwork,
  getInvestorLPAssociatedTokenAddress,
  getLPTokenMintPK,
} from "./credix-program-api";
import { OpenOrdersPda } from "@project-serum/serum";
import { Order } from "@project-serum/serum/lib/market";

const DEX_PID = new PublicKey("9xQeWvG816bUx9EPjHmaT23yvVM2ZWbrrpZb9PusVFin");
const referral = new PublicKey("EoYuxcwTfyznBF2ebzZ8McqvveyxtMNTGAXGmNKycchB");

const credixProgramID = new PublicKey(
  "v1yuc1NDc1N1YBWGFdbGjEDBXepcbDeHY1NphTCgkAP"
);
const marketAddress = new PublicKey(
  "FcZntrVjDRPv8JnU2mHt8ejvvA1eiHqxM8d8JNEC8q9q"
);
const permissionedMarketProgram = new PublicKey(
  "iPRL869bGrTiJZP6GW2ysPYXV9PMKSMAr6CYhRJx3zq"
);
const GLOBALMARKETSEED = "credix-market";
const globalMarketState = new PublicKey(
  "6Tep3DBfjdEzqLYaNTGbn7NDX1vpN9sB6yHt2ZxY2ziQ"
);

export const initOrderAccount = async (
  connection: Connection,
  wallet: AnchorWallet
) => {
  let marketProxy = await loadCredixPermissionedMarket(
    connection,
    permissionedMarketProgram,
    DEX_PID,
    marketAddress,
    await getLPTokenMintPK(connection, wallet, globalMarketState),
    credixProgramID,
    GLOBALMARKETSEED,
    await getGatekeeperNetwork(connection, wallet, globalMarketState)
  );
  // let tx = new Transaction();
  // tx.add(
  //   marketProxy.instruction.initOpenOrders(
  //     wallet.publicKey,
  //     marketProxy.market.address,
  //     marketProxy.market.address,
  //     marketProxy.market.address
  //   )
  // );

  // await wallet.signTransaction(tx);
  // try {
  //   await connection.sendTransaction(tx, []);
  // } catch (e) {
  //   console.log(e);
  // }
};

// export const newOrderv3 = async (
//   connection: Connection,
//   wallet: AnchorWallet,
//   side: "buy" | "sell",
//   price: number,
//   limit: number
// ) => {
//   let marketProxy = await loadCredixPermissionedMarket(
//     connection,
//     permissionedMarketProgram,
//     DEX_PID,
//     marketAddress,
//     await getLPTokenMintPK(connection, wallet, globalMarketState),
//     credixProgramID,
//     GLOBALMARKETSEED,
//     await getGatekeeperNetwork(connection, wallet, globalMarketState)
//   );

//   let payer;

//   let openOrder = await OpenOrdersPda.openOrdersAddress(
//     marketProxy.market.address,
//     wallet.publicKey,
//     marketProxy.dexProgramId,
//     marketProxy.proxyProgramId
//   );
//   if (side === "buy") {
//     payer = await getAssociatedBaseTokenAddressPK(
//       connection,
//       wallet,
//       wallet.publicKey,
//       false,
//       globalMarketState
//     );
//   } else {
//     payer = await getInvestorLPAssociatedTokenAddress(
//       connection,
//       wallet,
//       globalMarketState
//     );
//   }

//   let tx = new Transaction();
//   tx.add(
//     marketProxy.instruction.newOrderV3({
//       owner: wallet.publicKey,
//       payer: payer,
//       side: side,
//       price: price,
//       size: limit,
//       orderType: "postOnly",
//       clientId: undefined,
//       openOrdersAddressKey: openOrder,
//       selfTradeBehavior: "abortTransaction",
//     })
//   );

//   // await wallet.signTransaction(tx);
//   // try {
//   //   await connection.sendTransaction(tx, []);
//   // } catch (e) {
//   //   console.log(e);
//   // }
// };

// export const cancelOrder = async (
//   connection: Connection,
//   wallet: AnchorWallet,
//   order: Order
// ) => {
//   let marketProxy = await loadCredixPermissionedMarket(
//     connection,
//     permissionedMarketProgram,
//     DEX_PID,
//     marketAddress,
//     await getLPTokenMintPK(connection, wallet, globalMarketState),
//     credixProgramID,
//     GLOBALMARKETSEED,
//     await getGatekeeperNetwork(connection, wallet, globalMarketState)
//   );
//   let tx = new Transaction();
//   tx.add(marketProxy.instruction.cancelOrder(wallet.publicKey, order));

//   // await wallet.signTransaction(tx);
//   // try {
//   //   await connection.sendTransaction(tx, []);
//   // } catch (e) {
//   //   console.log(e);
//   // }
// };

// export const settleOrder = async (
//   connection: Connection,
//   wallet: AnchorWallet
// ) => {
//   let marketProxy = await loadCredixPermissionedMarket(
//     connection,
//     permissionedMarketProgram,
//     DEX_PID,
//     marketAddress,
//     await getLPTokenMintPK(connection, wallet, globalMarketState),
//     credixProgramID,
//     GLOBALMARKETSEED,
//     await getGatekeeperNetwork(connection, wallet, globalMarketState)
//   );

//   const usdcAccount = await getAssociatedBaseTokenAddressPK(
//     connection,
//     wallet,
//     wallet.publicKey,
//     false,
//     globalMarketState
//   );
//   const lpTokenAccount = await getInvestorLPAssociatedTokenAddress(
//     connection,
//     wallet,
//     globalMarketState
//   );
//   const referralUsdc = await getAssociatedBaseTokenAddressPK(
//     connection,
//     wallet,
//     referral,
//     false,
//     globalMarketState
//   );

//   let openOrder = await OpenOrdersPda.openOrdersAddress(
//     marketProxy.market.address,
//     wallet.publicKey,
//     marketProxy.dexProgramId,
//     marketProxy.proxyProgramId
//   );

//   let tx = new Transaction();
//   tx.add(
//     await marketProxy.instruction.settleFunds(
//       openOrder,
//       wallet.publicKey,
//       lpTokenAccount,
//       usdcAccount,
//       referralUsdc
//     )
//   );

//   // await wallet.signTransaction(tx);
//   // try {
//   //   await connection.sendTransaction(tx, []);
//   // } catch (e) {
//   //   console.log(e);
//   // }
// };
