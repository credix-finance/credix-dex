import { findGatewayToken } from "@identity.com/solana-gateway-ts";
import { Provider, utils } from "@project-serum/anchor";
import { makeSaberProvider, newProgram } from "@saberhq/anchor-contrib";
import {
  useAnchorWallet,
  useConnection,
  useWallet,
} from "@solana/wallet-adapter-react";
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
import { useCallback, useEffect, useState } from "react";
import { IDL } from "./credix";
import { CredixProgram } from "./idl.types";
import {
  ASSOCIATED_TOKEN_PROGRAM_ID,
  Token,
  TOKEN_PROGRAM_ID,
} from "@solana/spl-token";

require("@solana/wallet-adapter-react-ui/styles.css");

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
    size: 3000,
    price: 34234,
    type: OrderType.BUY,
  },
  {
    size: 12232,
    price: 4343434,
    type: OrderType.SELL,
  },
];

export const Dex = () => {
  const [limitPrice, setLimitPrice] = useState<number>();
  const [amount, setAmount] = useState<number>();
  const [buyTabActive, setBuyTabActive] = useState<boolean>(true);
  const { Header, Footer, Content } = Layout;
  const [orders, setOrders] = useState(testOrders);
  const [usdcBalance, setUSDCBalance] = useState<string>();
  const [hasCivicPass, setHasCivicPass] = useState(false);

  const connection = useConnection();
  const wallet = useWallet();
  const anchorWallet = useAnchorWallet();

  const getUSDCBalance = useCallback(async () => {
    if (anchorWallet) {
      const provider = new Provider(
        connection.connection,
        anchorWallet,
        Provider.defaultOptions()
      );
      const saberProvider = makeSaberProvider(provider);
      const programId = new PublicKey(
        "v1yuc1NDc1N1YBWGFdbGjEDBXepcbDeHY1NphTCgkAP"
      );
      const program = newProgram<CredixProgram>(IDL, programId, saberProvider);
      const seed = Buffer.from(utils.bytes.utf8.encode("credix-marketplace"));
      const marketPDA = await PublicKey.findProgramAddress([seed], programId);
      const market = await program.account.globalMarketState.fetchNullable(
        marketPDA[0]
      );

      if (market) {
        const baseMint = market.liquidityPoolTokenMintAccount;
        const baseTokenAddress = await Token.getAssociatedTokenAddress(
          ASSOCIATED_TOKEN_PROGRAM_ID,
          TOKEN_PROGRAM_ID,
          baseMint,
          anchorWallet.publicKey
        );
        const tokenAmount =
          await program.provider.connection.getTokenAccountBalance(
            baseTokenAddress
          );

        setUSDCBalance(tokenAmount.value.uiAmountString);

        const gatekeeperNetwork = market.gatekeeperNetwork;
        const gatewayToken = await findGatewayToken(
          connection.connection,
          anchorWallet.publicKey,
          gatekeeperNetwork
        );

        setHasCivicPass(!!gatewayToken);
      }
    }
  }, [anchorWallet, connection.connection]);

  useEffect(() => {
    getUSDCBalance();
  }, [getUSDCBalance]);

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
                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    marginTop: "12.5px",
                  }}
                >
                  <Row>
                    <Col span={12}>
                      <Button size="large" type="primary" block>
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
                <h1 style={{ margin: 0 }}>{`Get LP${
                  usdcBalance ? " - " + usdcBalance : ""
                }`}</h1>
              </div>
              <div style={{ padding: "25px", paddingTop: 0 }}>
                <Row gutter={25}>
                  <Col span={12}>
                    <InputNumber size="large" style={{ width: "100%" }} />
                  </Col>
                  <Col span={12}>
                    <Button size="large" type="primary" block>
                      Deposit USDC
                    </Button>
                  </Col>
                </Row>
              </div>
            </Card>
          </Col>

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
                      <h1 style={{ margin: 0, display: "inline" }}>
                        Size (LP)
                      </h1>
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
                            <div>{o.size}</div>
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
                            <div>{o.price}</div>
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
                      <h1 style={{ margin: 0, display: "inline" }}>
                        Size (LP)
                      </h1>
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
                            <div>{o.size}</div>
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
                            <div>{o.price}</div>
                          </div>
                        </Col>
                      </Row>
                    </div>
                  ))}
              </div>
            </Card>
          </Col>
        </Row>
      </Content>
    </Layout>
  );
};
