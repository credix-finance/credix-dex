import {
  findGatewayToken,
  GatewayToken,
} from "@identity.com/solana-gateway-ts";
import { BN, Provider, utils } from "@project-serum/anchor";
import { makeSaberProvider, newProgram } from "@saberhq/anchor-contrib";
import { useAnchorWallet, useConnection } from "@solana/wallet-adapter-react";
import { WalletMultiButton } from "@solana/wallet-adapter-react-ui";
import { PublicKey } from "@solana/web3.js";
import {
  Button,
  Card,
  Checkbox,
  Col,
  Divider,
  Image,
  InputNumber,
  Layout,
  Row,
} from "antd";
import { useCallback, useEffect, useMemo, useState } from "react";
import { CredixProgram, GlobalMarketState } from "../pages/api/idl.types";
import {
  ASSOCIATED_TOKEN_PROGRAM_ID,
  Token,
  TOKEN_PROGRAM_ID,
} from "@solana/spl-token";
import { findProgramAddressSync } from "@project-serum/anchor/dist/cjs/utils/pubkey";
import { IDL } from "../pages/idl/credix";
import { AnchorWallet } from "@solana/wallet-adapter-react";
import { Connection } from "@solana/web3.js";
import {
  createCredixPass,
  getAssociatedBaseTokenAddressPK,
  getBaseMintPK,
  getInvestorLPAssociatedTokenAddress,
  getLPTokenMintPK,
} from "../pages/api/credix-program-api";

require("@solana/wallet-adapter-react-ui/styles.css");

interface CredixComponentInterface {
  connection: Connection;
  wallet?: AnchorWallet;
}

export const NavbarComponent = ({
  connection,
  wallet,
}: CredixComponentInterface) => {
  const { Header } = Layout;
  // const [solAmount, setSolAmount] = useState<Number>(0);
  // const [lpTokenAmount, setLPTokenAccount] = useState<Number>(0);
  // const [baseTokenAmount, setBaseTokenAccount] = useState<Number>(0);

  // const globalMarketState = new PublicKey(
  //   "6Tep3DBfjdEzqLYaNTGbn7NDX1vpN9sB6yHt2ZxY2ziQ"
  // );
  // const [userAssociatedBaseTokenAddressPK, setBase] = useState<
  //   PublicKey | undefined
  // >();

  // const [investorLPAssociatedTokenAddress, setLp] = useState<
  //   PublicKey | undefined
  // >();

  // const reloadBalance = async () => {
  //   if (wallet === undefined) {
  //     setLp(undefined);
  //     setBase(undefined);
  //     setSolAmount(0);
  //     setLPTokenAccount(0);
  //     setBaseTokenAccount(0);
  //     return;
  //   }
  //   let base = userAssociatedBaseTokenAddressPK;
  //   let lp = investorLPAssociatedTokenAddress;
  //   if (
  //     userAssociatedBaseTokenAddressPK === undefined ||
  //     investorLPAssociatedTokenAddress === undefined
  //   ) {
  //     base = await getAssociatedBaseTokenAddressPK(
  //       connection,
  //       wallet,
  //       wallet.publicKey,
  //       false,
  //       globalMarketState
  //     );
  //     setBase(base);
  //     lp = await getInvestorLPAssociatedTokenAddress(
  //       connection,
  //       wallet,
  //       globalMarketState
  //     );
  //     setLp(lp);
  //   }

  //   connection.getBalance(wallet.publicKey).then((n) => {
  //     setSolAmount(n / 10 ** 9);
  //   });
  //   try {
  //     if (base !== undefined) {
  //       let data = await connection.getTokenAccountBalance(base!, undefined);
  //       setBaseTokenAccount(data.value.uiAmount ? data.value.uiAmount : 0);
  //     }
  //   } catch (e) {
  //     console.log(e);
  //   }
  //   try {
  //     if (lp !== undefined) {
  //       let data = await connection.getTokenAccountBalance(lp!, undefined);
  //       setLPTokenAccount(data.value.uiAmount ? data.value.uiAmount : 0);
  //     }
  //   } catch (e) {
  //     console.log(e);
  //   }
  // };

  return (
    <Header
      style={{
        height: "100px",
        background: "white",
        boxShadow: "0px 0px 10px 1px rgba(0,0,0,0.1)",
        padding: "25px",
      }}
    >
      <div
        style={{
          height: "100%",
          display: "flex",
          flexDirection: "row",
          justifyContent: "space-between",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <div
            style={{
              height: "100%",
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
            }}
          >
            <Image
              width={30}
              src="https://app.credix.finance/static/media/credix_logo_zwart.5ad312ee.svg"
              alt="credix-logo"
            />
          </div>
          <h1 style={{ margin: 0, marginLeft: "25px" }}>Serum Hackathon</h1>
        </div>
        <div
          style={{
            display: "flex",
            height: "100%",
            alignItems: "center",
            flexDirection: "row",
            justifyContent: "flex-end",
            gap: "25px",
          }}
        >
          <Button
            size="large"
            type="primary"
            onClick={() => {
              window
                .open("https://spl-token-faucet.com/?token-name=USDC", "_blank")
                ?.focus();
            }}
          >
            Get USDC
          </Button>
          <WalletMultiButton />
          {/* <Button
            size="small"
            type="primary"
            onClick={() => {
              reloadBalance();
            }}
          >
            Check balance
          </Button>
          <h3>
            Balance: {solAmount} SOL, {lpTokenAmount} LP Tokens,
            {baseTokenAmount} base Tokens
          </h3> */}
        </div>
      </div>
    </Header>
  );
};
