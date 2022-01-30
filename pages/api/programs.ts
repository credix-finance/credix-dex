import { Provider, Wallet } from "@project-serum/anchor";
import { makeSaberProvider, newProgram } from "@saberhq/anchor-contrib";
import { Connection, PublicKey } from "@solana/web3.js";
import { CredixProgram } from "./idl.types";
import { IDL as credixIDL } from "../idl/credix";
import { AnchorWallet } from "@solana/wallet-adapter-react";

export const newCredixProgram = (
  connection: Connection,
  wallet: AnchorWallet
) => {
  const provider = new Provider(connection, wallet, {});
  const saberProvider = makeSaberProvider(provider);
  return newProgram<CredixProgram>(
    credixIDL,
    new PublicKey("v1yuc1NDc1N1YBWGFdbGjEDBXepcbDeHY1NphTCgkAP"),
    saberProvider
  );
};
