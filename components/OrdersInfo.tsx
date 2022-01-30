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



interface ComponenetInterface {
  connection: Connection;
  wallet?: AnchorWallet;
}

export const OrdersInfo = ({
  connection,
  wallet,
}: ComponenetInterface) => {
  const [orders, setOrders] = useState(testOrders);

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
          <Row justify="space-around">
            <Col span={8}>
              <div
                style={{
                  display: "flex",
                  justifyContent: "center",
                }}
              >
                <h1 style={{ margin: 0, display: "inline" }}>Size (LP)</h1>
              </div>
            </Col>
            <Col span={8}>
              <div
                style={{
                  display: "flex",
                  justifyContent: "center",
                }}
              >
                <h1 style={{ margin: 0, display: "inline" }}>SELL</h1>
              </div>
            </Col>
            <Col span={8}>
              <div
                style={{
                  display: "flex",
                  justifyContent: "center",
                }}
              >
                <h1 style={{ margin: 0 }}>Price (USDC)</h1>
              </div>
            </Col>
          </Row>
          {orders
            .filter((o) => o.type === OrderType.SELL)
            .sort((a, b) => (a.price > b.price ? -1 : 1))
            .map((o, i) => (
              <div key={i}>
                <Divider style={{ margin: "12.5px" }} />
                <Row key={i}>
                  <Col span={12}>
                    <div
                      style={{
                        display: "flex",
                        alignContent: "center",
                        justifyContent: "center",
                      }}
                    >
                      <div style={{ color: "red" }}>{o.size}</div>
                    </div>
                  </Col>
                  <Col span={12}>
                    <div
                      style={{
                        display: "flex",
                        alignContent: "center",
                        justifyContent: "center",
                      }}
                    >
                      <div style={{ color: "red" }}>{o.price}</div>
                    </div>
                  </Col>
                </Row>
              </div>
            ))}
          <Row style={{ marginTop: "25px" }} justify="space-around">
            <Col span={8}>
              <div
                style={{
                  display: "flex",
                  justifyContent: "center",
                }}
              >
                <h1 style={{ margin: 0, display: "inline" }}>Size (LP)</h1>
              </div>
            </Col>
            <Col span={8}>
              <div
                style={{
                  display: "flex",
                  justifyContent: "center",
                }}
              >
                <h1 style={{ margin: 0, display: "inline" }}>BUY</h1>
              </div>
            </Col>
            <Col span={8}>
              <div
                style={{
                  display: "flex",
                  justifyContent: "center",
                }}
              >
                <h1 style={{ margin: 0 }}>Price (USDC)</h1>
              </div>
            </Col>
          </Row>
          {orders
            .filter((o) => o.type === OrderType.BUY)
            .sort((a, b) => (a.price < b.price ? -1 : 1))
            .map((o, i) => (
              <div key={i}>
                <Divider style={{ margin: "12.5px" }} />
                <Row key={i}>
                  <Col span={12}>
                    <div
                      style={{
                        display: "flex",
                        alignContent: "center",
                        justifyContent: "center",
                      }}
                    >
                      <div style={{ color: "green" }}>{o.size}</div>
                    </div>
                  </Col>
                  <Col span={12}>
                    <div
                      style={{
                        display: "flex",
                        alignContent: "center",
                        justifyContent: "center",
                      }}
                    >
                      <div style={{ color: "green" }}>{o.price}</div>
                    </div>
                  </Col>
                </Row>
              </div>
            ))}
        </div>
      </Card>
    </Col>
  );
};


enum OrderType {
  BUY,
  SELL,
}

// JUST FOR DEVELOPPING
const testOrders = [
  {
    size: 3000,
    price: 34234,
    type: OrderType.SELL,
  },
  {
    size: 12232,
    price: 4343434,
    type: OrderType.BUY,
  },
  {
    size: 2603,
    price: 34233,
    type: OrderType.BUY,
  },
  {
    size: 232,
    price: 50334,
    type: OrderType.SELL,
  },
];
