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
import { createCredixPass } from "../pages/api/credix-program-api";
import { CredixComponent } from "./CredixComponenet";
import { CreateSerumOrder } from "./CreateSerumOrders";
import { OrdersInfo } from "./OrdersInfo";

require("@solana/wallet-adapter-react-ui/styles.css");

export const Dex = () => {
  const { Header, Content } = Layout;

  const connection = useConnection();
  const anchorWallet = useAnchorWallet();

  // const getProgram = useCallback(() => {
  //   if (anchorWallet) {
  //     const provider = new Provider(
  //       connection.connection,
  //       anchorWallet,
  //       Provider.defaultOptions()
  //     );
  //     const saberProvider = makeSaberProvider(provider);
  //     return newProgram<CredixProgram>(IDL, programId, saberProvider);
  //   }
  // }, [anchorWallet, programId, connection.connection]);

  // const getMarketPDA = useCallback(() => {
  //   const program = getProgram();

  //   if (!program) {
  //     return;
  //   }

  //   const seed = Buffer.from(utils.bytes.utf8.encode("credix-marketplace"));
  //   return PublicKey.findProgramAddress([seed], programId);
  // }, [getProgram, programId]);

  // const getUSDCBalance = useCallback(async () => {
  //   if (anchorWallet) {
  //     const program = getProgram();

  //     if (!program) {
  //       return;
  //     }

  //     const marketPDA = await getMarketPDA();

  //     if (!marketPDA) {
  //       return;
  //     }

  //     const market = await program.account.globalMarketState.fetchNullable(
  //       marketPDA[0]
  //     );

  //     if (market) {
  //       const baseMint = market.liquidityPoolTokenMintAccount;
  //       const baseTokenAddress = await Token.getAssociatedTokenAddress(
  //         ASSOCIATED_TOKEN_PROGRAM_ID,
  //         TOKEN_PROGRAM_ID,
  //         baseMint,
  //         anchorWallet.publicKey
  //       );
  //       const tokenAmount =
  //         await program.provider.connection.getTokenAccountBalance(
  //           baseTokenAddress
  //         );

  //       setUSDCBalance(tokenAmount.value.uiAmountString);

  //       const gatekeeperNetwork = market.gatekeeperNetwork;
  //       const gatewayToken = await findGatewayToken(
  //         connection.connection,
  //         anchorWallet.publicKey,
  //         gatekeeperNetwork
  //       );

  //       setCivicPass(gatewayToken || undefined);
  //     }
  //   }
  // }, [anchorWallet, connection.connection, getProgram, getMarketPDA]);

  // useEffect(() => {
  //   getUSDCBalance();
  // }, [getUSDCBalance]);

  return (
    <Layout
      style={{
        height: "100vh",
      }}
    >
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
                  .open(
                    "https://spl-token-faucet.com/?token-name=USDC",
                    "_blank"
                  )
                  ?.focus();
              }}
            >
              Get USDC
            </Button>
            <WalletMultiButton />
          </div>
        </div>
      </Header>

      <Content style={{ padding: "50px" }}>
        <Row
          style={{
            height: "100%",
            boxShadow: "0px 0px 10px 1px rgba(0,0,0,0.1)",
          }}
        >
          <CredixComponent
            wallet={anchorWallet}
            connection={connection.connection}
          ></CredixComponent>

          <CreateSerumOrder
            wallet={anchorWallet}
            connection={connection.connection}
          ></CreateSerumOrder>

          <OrdersInfo
            wallet={anchorWallet}
            connection={connection.connection}
          ></OrdersInfo>
        </Row>
      </Content>
    </Layout>
  );
};
