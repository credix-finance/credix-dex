import { useAnchorWallet, useConnection } from "@solana/wallet-adapter-react";
import { PublicKey } from "@solana/web3.js";
import { useEffect, useState } from "react";

export const IdentityButton = () => {
  const wallet = useAnchorWallet();
  const connection = useConnection();
  const marketSeed = "credix-market";

  const [gatekeeperNetwork, setGatekeeperNetwork] = useState<PublicKey>();

  useEffect(() => {
    const updateGatekeeperNetwork = async () => {
      const gatekeeperNetwork = await getGatekeeperNetwork(
        connection.connection,
        wallet as typeof Wallet,
        marketSeed
      );
      setGatekeeperNetwork(gatekeeperNetwork);
    };

    if (wallet?.publicKey && connection.connection) {
      updateGatekeeperNetwork();
    }
  }, [connection.connection, wallet, marketSeed]);

  const mapClusterNameToStage = (clusterName: SolanaCluster) => {
    switch (clusterName) {
      case SolanaCluster.LOCALNET: {
        return "local";
      }
      case SolanaCluster.DEVNET: {
        return "preprod";
      }
      case SolanaCluster.MAINNET: {
        return "prod";
      }
      default: {
        break;
      }
    }
  };

  return (
    <>
      <GatewayProvider
        wallet={wallet}
        stage={mapClusterNameToStage(config.clusterConfig.name)}
        gatekeeperNetwork={gatekeeperNetwork}
        clusterUrl={config.clusterConfig.RPCEndpoint}
      >
        {gatekeeperNetwork && (
          <CivicHeaderSection gatekeeperNetwork={gatekeeperNetwork} />
        )}
      </GatewayProvider>
    </>
  );
};
