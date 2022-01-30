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
import { createCredixPass } from "../pages/api/credix-program-api";

require("@solana/wallet-adapter-react-ui/styles.css");

interface CredixComponenetInterface {
  connection: Connection;
  wallet?: AnchorWallet;
}

export const CredixComponent = ({
  connection,
  wallet,
}: CredixComponenetInterface) => {
  const deposit = async () => {};
  const [depositAmount, setDepositAmount] = useState<number>();

  const getCredixPassOnclick = async () => {
    if (wallet == undefined) {
      alert("wallet not connected");
      return;
    }
    createCredixPass(connection, wallet!);
  };

  return (
    <Col span={8}>
      <Card style={{ height: "100%", padding: 0 }}>
        <div style={{ padding: "25px" }}>
          <h1 style={{ margin: 0 }}>Pass</h1>
        </div>
        <div style={{ padding: "25px", paddingTop: 0 }}>
          <div style={{ display: "flex", flexDirection: "column" }}>
            <Row>
              <Col span={12}>
                <Button size="large" type="primary" block>
                  Get Civic pass
                </Button>
              </Col>
              <Col span={12}>
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    height: "100%",
                  }}
                >
                  <Checkbox style={{ marginLeft: "25px" }} />
                </div>
              </Col>
            </Row>
          </div>
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              marginTop: "12.5px",
            }}
          >
            <Row>
              <Col span={12}>
                <Button
                  size="large"
                  type="primary"
                  block
                  onClick={getCredixPassOnclick}
                >
                  Get Credix pass
                </Button>
              </Col>
              <Col span={12}>
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    height: "100%",
                  }}
                >
                  <Checkbox style={{ marginLeft: "25px" }} />
                </div>
              </Col>
            </Row>
          </div>
        </div>
        <div
          style={{
            padding: "25px",
            borderTop: "2px solid rgb(240, 242, 245, 0.85)",
          }}
        >
          <h1 style={{ margin: 0 }}>{
            `Get`
            // LP${
            //   usdcBalance ? " - " + usdcBalance : ""
            // }`
          }</h1>
        </div>
        <div style={{ padding: "25px", paddingTop: 0 }}>
          <Row gutter={25}>
            <Col span={12}>
              <InputNumber
                size="large"
                style={{ width: "100%" }}
                onChange={(v) => setDepositAmount(Number(v))}
              />
            </Col>
            <Col span={12}>
              <Button size="large" type="primary" block onClick={deposit}>
                Deposit USDC
              </Button>
            </Col>
          </Row>
        </div>
      </Card>
    </Col>
  );
};
