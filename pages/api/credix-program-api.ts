import {
  ASSOCIATED_TOKEN_PROGRAM_ID,
  Token,
  TOKEN_PROGRAM_ID,
} from "@solana/spl-token";
import { Connection, PublicKey } from "@solana/web3.js";
import * as anchor from "@project-serum/anchor";
import {
  addGatekeeper,
  issueVanilla,
  findGatewayToken,
} from "@identity.com/solana-gateway-ts";
import * as fs from "fs";
import { newCredixProgram } from "./programs";
import { Provider, Wallet } from "@project-serum/anchor";
import { AnchorWallet } from "@solana/wallet-adapter-react";

const credixProgramID = new PublicKey(
  "v1yuc1NDc1N1YBWGFdbGjEDBXepcbDeHY1NphTCgkAP"
);

const GLOBALMARKETSEED = "credix-market";

export const getGlobalMarketPda = async () => {
  return await PublicKey.findProgramAddress(
    [Buffer.from(anchor.utils.bytes.utf8.encode(GLOBALMARKETSEED))],
    credixProgramID
  );
};

export const getSigningAuthorityPDa = async (globalMarketPK: PublicKey) => {
  return await PublicKey.findProgramAddress(
    [globalMarketPK.toBuffer()],
    credixProgramID
  );
};

const getCredixPassPda = async (
  globalMarketState: PublicKey,
  address: PublicKey
) => {
  return await PublicKey.findProgramAddress(
    [
      globalMarketState.toBuffer(),
      address.toBuffer(),
      Buffer.from(anchor.utils.bytes.utf8.encode("credix-pass")),
    ],
    credixProgramID
  );
};

export const createCredixPass = async (
  connection: Connection,
  wallet: AnchorWallet
) => {
  const [globalMarketStatePda, _globalMarketStateBump] =
    await getGlobalMarketPda();

  const [credixPass, bump] = await getCredixPassPda(
    globalMarketStatePda,
    wallet.publicKey
  );

  const program = newCredixProgram(connection, wallet);

  await program.rpc.createCredixPass(bump, {
    accounts: {
      owner: wallet.publicKey,
      passHolder: wallet.publicKey,
      globalMarketState: globalMarketStatePda,
      credixPass: credixPass,
      systemProgram: anchor.web3.SystemProgram.programId,
      rent: anchor.web3.SYSVAR_RENT_PUBKEY,
    },
    signers: [],
  });
};

export const updateCredixPass = async (
  connection: Connection,
  wallet: AnchorWallet,
  newStatus: boolean
) => {
  const [globalMarketStatePda, _globalMarketStateBump] =
    await getGlobalMarketPda();

  const [credixPass, bump] = await getCredixPassPda(
    globalMarketStatePda,
    wallet.publicKey
  );

  const program = newCredixProgram(connection, wallet);

  await program.rpc.updateCredixPass(newStatus, {
    accounts: {
      owner: wallet.publicKey,
      passHolder: wallet.publicKey,
      globalMarketState: globalMarketStatePda,
      credixPass: credixPass,
    },
    signers: [],
  });
};

export const getGlobalMarketStateAccountData = async (
  connection: Connection,
  wallet: AnchorWallet,
  globalMarketState: PublicKey
) => {
  const program = newCredixProgram(connection, wallet);
  return program.account.globalMarketState.fetchNullable(globalMarketState);
};

const getBaseMintPK = async (
  connection: Connection,
  wallet: AnchorWallet,
  globalMarketState: PublicKey
) => {
  const globalMarketStateData = await getGlobalMarketStateAccountData(
    connection,
    wallet,
    globalMarketState
  );

  if (!globalMarketStateData) {
    throw Error("Market not found");
  }

  return globalMarketStateData.liquidityPoolTokenMintAccount;
};

const getLPTokenMintPK = async (
  connection: Connection,
  wallet: AnchorWallet,
  globalMarketState: PublicKey
) => {
  const globalMarketStateData = await getGlobalMarketStateAccountData(
    connection,
    wallet,
    globalMarketState
  );

  if (!globalMarketStateData) {
    throw Error("Market not found");
  }

  return globalMarketStateData.lpTokenMintAccount;
};

const getGatewayToken = async (
  connection: Connection,
  wallet: AnchorWallet,
  userPK: PublicKey,
  globalMarketState: PublicKey
) => {
  const gatekeeperNetwork = await getGatekeeperNetwork(
    connection,
    wallet as AnchorWallet,
    globalMarketState
  );
  const gatewayToken = await findGatewayToken(
    connection,
    userPK,
    gatekeeperNetwork
  );

  if (!gatewayToken) {
    throw Error("No valid Civic gateway token found");
  }

  return gatewayToken;
};

export const getGatekeeperNetwork = async (
  connection: Connection,
  wallet: AnchorWallet,
  globalMarketState: PublicKey
) => {
  const globalMarketStateData = await getGlobalMarketStateAccountData(
    connection,
    wallet,
    globalMarketState
  );

  if (!globalMarketStateData) {
    throw Error("Market not found");
  }

  return globalMarketStateData.gatekeeperNetwork;
};

const getAssociatedBaseTokenAddressPK = async (
  connection: Connection,
  wallet: AnchorWallet,
  publicKey: PublicKey,
  offCurve: boolean,
  globalMarketState: PublicKey
) => {
  const _baseMintPK = await getBaseMintPK(
    connection,
    wallet,
    globalMarketState
  );
  return await Token.getAssociatedTokenAddress(
    ASSOCIATED_TOKEN_PROGRAM_ID,
    TOKEN_PROGRAM_ID,
    _baseMintPK,
    publicKey,
    offCurve
  );
};

const getLiquidityPoolAssociatedBaseTokenAddressPK = async (
  connection: Connection,
  wallet: AnchorWallet,
  globalMarketState: PublicKey
) => {
  const signingAuthorityPDA = await getSigningAuthorityPDa(globalMarketState);
  return getAssociatedBaseTokenAddressPK(
    connection,
    wallet,
    signingAuthorityPDA[0],
    true,
    globalMarketState
  );
};

const getInvestorLPAssociatedTokenAddress = async (
  connection: Connection,
  wallet: AnchorWallet,
  globalMarketState: PublicKey
) => {
  const lpTokenMintPK = await getLPTokenMintPK(
    connection,
    wallet,
    globalMarketState
  );
  return Token.getAssociatedTokenAddress(
    ASSOCIATED_TOKEN_PROGRAM_ID,
    TOKEN_PROGRAM_ID,
    lpTokenMintPK,
    wallet.publicKey
  );
};

export const depositInvestment = async (
  amount: number,
  connection: Connection,
  wallet: AnchorWallet
) => {
  const depositAmount = new anchor.BN(amount);
  const program = newCredixProgram(connection, wallet);
  const [globalMarketStatePDA] = await getGlobalMarketPda();
  const lpTokenMintPK = await getLPTokenMintPK(
    connection,
    wallet,
    globalMarketStatePDA
  );
  const userAssociatedBaseTokenAddressPK =
    await getAssociatedBaseTokenAddressPK(
      connection,
      wallet,
      wallet.publicKey,
      false,
      globalMarketStatePDA
    );

  const baseMintPK = await getBaseMintPK(
    connection,
    wallet,
    globalMarketStatePDA
  );
  const marketBaseTokenAccountPK =
    await getLiquidityPoolAssociatedBaseTokenAddressPK(
      connection,
      wallet,
      globalMarketStatePDA
    );

  const signingAuthorityPDA = await getSigningAuthorityPDa(
    globalMarketStatePDA
  );

  const investorLPAssociatedTokenAddress =
    await getInvestorLPAssociatedTokenAddress(
      connection,
      wallet,
      globalMarketStatePDA
    );

  const getGatewayTokenAccount = await getGatewayToken(
    connection,
    wallet,
    wallet.publicKey,
    globalMarketStatePDA
  );

  const getCredixPassPDA = await getCredixPassPda(
    globalMarketStatePDA,
    wallet.publicKey
  );

  await program.rpc.depositFunds(depositAmount, {
    accounts: {
      investor: wallet.publicKey,
      gatewayToken: getGatewayTokenAccount.publicKey,
      globalMarketState: globalMarketStatePDA,
      signingAuthority: signingAuthorityPDA[0],
      investorTokenAccount: userAssociatedBaseTokenAddressPK,
      liquidityPoolTokenAccount: investorLPAssociatedTokenAddress,
      lpTokenMintAccount: lpTokenMintPK,
      investorLpTokenAccount: investorLPAssociatedTokenAddress,
      baseMintAccount: baseMintPK,
      credixPass: getCredixPassPDA[0],
      associatedTokenProgram: ASSOCIATED_TOKEN_PROGRAM_ID,
      tokenProgram: TOKEN_PROGRAM_ID,
      systemProgram: anchor.web3.SystemProgram.programId,
      rent: anchor.web3.SYSVAR_RENT_PUBKEY,
    },
    signers: [],
  });
};
