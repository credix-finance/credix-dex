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
  InputNumber,
  Image,
} from "antd";
import type { NextPage } from "next";
import { useMemo, useState } from "react";
import { Dex } from "../components/Dex";

require("@solana/wallet-adapter-react-ui/styles.css");

export const config = {
  clusterConfig: {
    RPCEndpoint: "http://127.0.0.1:8899",
  },
  confirmOptions: {
    commitment: "finalized",
  },
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

/* const Order = ({ size, price }) => {
  return (
  );
}; */

const Home: NextPage = () => {
  const [limitPrice, setLimitPrice] = useState<number>();
  const [amount, setAmount] = useState<number>();
  const [buyTabActive, setBuyTabActive] = useState<boolean>(true);
  const { Header, Footer, Content } = Layout;
  const wallets = useMemo(() => [new PhantomWalletAdapter()], []);
  const [orders, setOrders] = useState(testOrders);

  return (
    <ConnectionProvider
      endpoint={config.clusterConfig.RPCEndpoint}
      config={{ commitment: config.confirmOptions.commitment as Commitment }}
    >
      <WalletProvider wallets={wallets} autoConnect>
        <WalletModalProvider>
          <Dex />
        </WalletModalProvider>
      </WalletProvider>
    </ConnectionProvider>
  );
};

export default Home;
