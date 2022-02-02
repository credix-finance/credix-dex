import {
  Badge,
  GatewayStatus,
  IdentityButton,
  useGateway,
} from "@civic/solana-gateway-react";
import { useAnchorWallet, useConnection } from "@solana/wallet-adapter-react";
import { PublicKey } from "@solana/web3.js";

interface Props {
  gatekeeperNetwork: PublicKey;
}

export const CivicStuff = (props: Props) => {
  const wallet = useAnchorWallet();
  const connection = useConnection();
  const { gatewayStatus, requestGatewayToken } = useGateway();

  return (
    <>
      {wallet?.publicKey && (
        <>
          {props.gatekeeperNetwork && (
            <div style={{ lineHeight: "4px" }}>
              <Badge
                clusterName="devnet"
                gatekeeperNetwork={props.gatekeeperNetwork}
                publicKey={wallet.publicKey}
                connection={connection.connection}
              />
            </div>
          )}
          {gatewayStatus !== GatewayStatus.ACTIVE && (
            <div>
              <IdentityButton onClick={requestGatewayToken} />
            </div>
          )}
        </>
      )}
    </>
  );
};
