import { Commitment } from "@solana/web3.js";
import {
  ConnectionProvider,
  WalletProvider,
} from "@solana/wallet-adapter-react";
import {
  WalletModalProvider,
  WalletMultiButton,
} from "@solana/wallet-adapter-react-ui";
import { PhantomWalletAdapter } from "@solana/wallet-adapter-wallets";
import {
  Layout,
  Row,
  Col,
  Button,
  Divider,
  Checkbox,
  Card,
  Tabs,
  Input,
} from "antd";
import type { NextPage } from "next";
import { useMemo, useState } from "react";

require("@solana/wallet-adapter-react-ui/styles.css");

export const config = {
  clusterConfig: {
    RPCEndpoint: "http://127.0.0.1:8899",
  },
  confirmOptions: {
    commitment: "finalized",
  },
};

const Home: NextPage = () => {
  const [buyTabActive, setBuyTabActive] = useState<boolean>(true);
  const { Header, Footer, Content } = Layout;
  const wallets = useMemo(() => [new PhantomWalletAdapter()], []);

  return (
    <ConnectionProvider
      endpoint={config.clusterConfig.RPCEndpoint}
      config={{ commitment: config.confirmOptions.commitment as Commitment }}
    >
      <WalletProvider wallets={wallets} autoConnect>
        <WalletModalProvider>
          <Layout style={{ height: "100vh" }}>
            <Header style={{ height: "100px", background: "white" }}>
              <div
                style={{
                  height: "100%",
                  display: "flex",
                  flexDirection: "row",
                  justifyContent: "space-between",
                }}
              >
                <div style={{ display: "flex", alignItems: "center" }}>
                  <h1 style={{ margin: 0 }}>Serum Hackathon</h1>
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
              <Row style={{ height: "100%" }}>
                <Col span={8}>
                  <Card style={{ height: "100%", padding: 0 }}>
                    <div style={{ padding: "25px" }}>
                      <h1 style={{ margin: 0 }}>Pass</h1>
                    </div>
                    <div style={{ padding: "25px", paddingTop: 0 }}>
                      <div style={{ display: "flex", flexDirection: "column" }}>
                        <Row>
                          <Col flex="1 1 100px">
                            <Button size="large" type="primary" block>
                              Get Credix pass
                            </Button>
                          </Col>
                          <Col flex="0 1 200px">
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
                          <Col flex="1 1 100px">
                            <Button size="large" type="primary" block>
                              Get Credix pass
                            </Button>
                          </Col>
                          <Col flex="0 1 200px">
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
                    <Divider style={{ margin: 0 }} />
                    <div style={{ padding: "25px" }}>
                      <h1 style={{ margin: 0 }}>Get LP</h1>
                      <div style={{ padding: "25px", paddingTop: 0 }}></div>
                    </div>
                  </Card>
                </Col>

                <Col span={8}>
                  <Card style={{ height: "100%", padding: 0 }}>
                    <div style={{ padding: "25px" }}>
                      <h1 style={{ margin: 0 }}>Trade LP/USDC</h1>
                    </div>
                    <div style={{ padding: "25px", paddingTop: 0 }}>
                      <div
                        style={{
                          borderRadius: "2px",
                          border: "1px solid rgb(240, 242, 245, 0.85)",
                        }}
                      >
                        <Row>
                          <Col span={12}>
                            <div
                              style={{
                                border: buyTabActive
                                  ? "1px solid #1890ff"
                                  : undefined,
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                borderRadius: buyTabActive
                                  ? "2px"
                                  : "0 2px 0 0",
                                padding: "12.5px",
                                height: "48px",
                                backgroundColor: !buyTabActive
                                  ? "rgb(240, 242, 245, 0.85)"
                                  : "white",
                              }}
                              onClick={() => setBuyTabActive(true)}
                            >
                              <div>Buy</div>
                            </div>
                          </Col>
                          <Col span={12}>
                            <div
                              style={{
                                border: !buyTabActive
                                  ? "1px solid #1890ff"
                                  : undefined,
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                borderRadius: !buyTabActive
                                  ? "2px"
                                  : "0 2px 0 0",
                                padding: "12.5px",
                                height: "48px",
                                backgroundColor: buyTabActive
                                  ? "rgb(240, 242, 245, 0.85)"
                                  : "white",
                              }}
                              onClick={() => setBuyTabActive(false)}
                            >
                              Sell
                            </div>
                          </Col>
                        </Row>
                        <Row>
                          <Col span={24}>
                            <div style={{ padding: "25px" }}>
                              <div>
                                <Input
                                  size="large"
                                  addonBefore="Limit price"
                                  addonAfter="USDC"
                                  type="number"
                                ></Input>
                              </div>
                              <div style={{ marginTop: "25px" }}>
                                <Input
                                  size="large"
                                  addonBefore="Amount"
                                  addonAfter="LP"
                                ></Input>
                              </div>
                            </div>
                          </Col>
                        </Row>
                        <Row>
                          <Col span={24}>
                            <Button size="large" block type="primary" onClick={console.log}>
                              Place order
                            </Button>
                          </Col>
                        </Row>
                      </div>
                    </div>
                  </Card>
                </Col>

                <Col span={8}>
                  <Card style={{ height: "100%", padding: 0 }}>
                    <div style={{ padding: "25px" }}>
                      <h1 style={{ margin: 0 }}>Order Book</h1>
                    </div>
                  </Card>
                </Col>
              </Row>
            </Content>

            <Footer
              style={{ display: "inline-block", backgroundColor: "white" }}
            >
              Credix Finance.
            </Footer>
          </Layout>
        </WalletModalProvider>
      </WalletProvider>
    </ConnectionProvider>
  );
};

export default Home;
