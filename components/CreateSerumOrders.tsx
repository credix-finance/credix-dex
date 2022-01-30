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
import {
  initOrderAccount,
  // newOrderv3,
} from "../pages/api/credix-proxy-market-api";

require("@solana/wallet-adapter-react-ui/styles.css");

interface ComponenetInterface {
  connection: Connection;
  wallet?: AnchorWallet;
}

export const CreateSerumOrder = ({
  connection,
  wallet,
}: ComponenetInterface) => {
  const [limitPrice, setLimitPrice] = useState<number>();
  const [amount, setAmount] = useState<number>();
  const [buyTabActive, setBuyTabActive] = useState<boolean>(true);

  const getCredixPassOnclick = async () => {
    if (wallet == undefined) {
      alert("wallet not connected");
      return;
    }
    createCredixPass(connection, wallet!);
  };

  const initializeOpenOrder = async () => {
    if (wallet == undefined) {
      alert("wallet not connected");
      return;
    }
    initOrderAccount(connection, wallet!);
  };

  const createOpenOrder = async () => {
    if (wallet == undefined) {
      alert("wallet not connected");
      return;
    }
    // newOrderv3(connection, wallet!, buyTabActive ? "buy" : "sell", 1, 1);
  };

  return (
    <Col span={8}>
      <Card style={{ height: "100%", padding: 0 }}>
        <div style={{ padding: "25px" }}>
          <h1 style={{ margin: 0 }}>Trade LP/USDC</h1>
        </div>
        <div
          style={{
            padding: "25px",
            paddingTop: 0,
            display: "flex",
            justifyContent: "center",
          }}
        >
          <div
            style={{
              borderRadius: "2px",
              border: "1px solid rgb(240, 242, 245, 0.85)",
              width: "100%",
            }}
          >
            <Button
              size="large"
              type="primary"
              block
              onClick={initializeOpenOrder}
            >
              Initalize Open Orders PDA
            </Button>

            <Row>
              <Col span={12}>
                <div
                  style={{
                    borderBottom: buyTabActive
                      ? "2px solid #1890ff"
                      : "2px solid rgb(240, 242, 245, 0.85)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    borderRadius: buyTabActive ? "2px" : "0 2px 0 0",
                    padding: "12.5px",
                    height: "48px",
                  }}
                  onClick={() => setBuyTabActive(true)}
                >
                  <div>Buy</div>
                </div>
              </Col>
              <Col span={12}>
                <div
                  style={{
                    borderBottom: !buyTabActive
                      ? "2px solid #1890ff"
                      : "2px solid rgb(240, 242, 245, 0.85)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    borderRadius: !buyTabActive ? "2px" : "0 2px 0 0",
                    padding: "12.5px",
                    height: "48px",
                  }}
                  onClick={() => setBuyTabActive(false)}
                >
                  Sell
                </div>
              </Col>
            </Row>
            <Row>
              <Col span={24}>
                <div
                  style={{
                    padding: "25px",
                    display: "flex",
                    flexDirection: "column",
                  }}
                >
                  <div>
                    <InputNumber
                      style={{ width: "100%" }}
                      size="large"
                      addonBefore="Limit price"
                      addonAfter="USDC"
                      onChange={(val) => setLimitPrice(Number(val))}
                    ></InputNumber>
                  </div>
                  <div style={{ marginTop: "25px" }}>
                    <InputNumber
                      style={{ width: "100%" }}
                      size="large"
                      addonBefore="Amount"
                      addonAfter="LP"
                      onChange={(val) => setAmount(Number(val))}
                    ></InputNumber>
                  </div>
                </div>
              </Col>
            </Row>
            <Row>
              <Col span={24}>
                <div style={{ padding: "25px", paddingTop: 0 }}>
                  <Button
                    style={{ height: "48px" }}
                    size="large"
                    block
                    type="primary"
                    onClick={() => console.log("place order")}
                  >
                    Place order
                  </Button>
                </div>
              </Col>
            </Row>
          </div>
        </div>
      </Card>
    </Col>
  );
};
