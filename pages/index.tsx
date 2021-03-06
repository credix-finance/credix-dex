import {
  ConnectionProvider,
  WalletProvider,
} from "@solana/wallet-adapter-react";
import { WalletModalProvider } from "@solana/wallet-adapter-react-ui";
import { PhantomWalletAdapter } from "@solana/wallet-adapter-wallets";
import { Commitment } from "@solana/web3.js";
import type { NextPage } from "next";
import { useMemo } from "react";
import { Dex } from "../components/Dex";

require("@solana/wallet-adapter-react-ui/styles.css");

export const RPCEndpoint = "https://api.devnet.solana.com";

export const config = {
  clusterConfig: {
    RPCEndpoint: RPCEndpoint,
  },
  confirmOptions: {
    commitment: "confirmed",
  },
};

const Home: NextPage = () => {
  const wallets = useMemo(() => [new PhantomWalletAdapter()], []);

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
