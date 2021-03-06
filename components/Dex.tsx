import {
  findGatewayToken,
  GatewayToken,
  getGatekeeperAccountKey,
  getGatewayTokenKeyForOwner,
  issueVanilla,
} from "@identity.com/solana-gateway-ts";
import { GatewayProvider } from "@civic/solana-gateway-react";
import { BN, Provider, utils } from "@project-serum/anchor";
import { makeSaberProvider, newProgram } from "@saberhq/anchor-contrib";
import {
  ASSOCIATED_TOKEN_PROGRAM_ID,
  Token,
  TOKEN_PROGRAM_ID,
} from "@solana/spl-token";
import {
  useAnchorWallet,
  useConnection,
  useWallet,
} from "@solana/wallet-adapter-react";
import { WalletMultiButton } from "@solana/wallet-adapter-react-ui";
import {
  PublicKey,
  SystemProgram,
  SYSVAR_RENT_PUBKEY,
  Transaction,
  TransactionInstruction,
} from "@solana/web3.js";
import {
  Button,
  Card,
  Checkbox,
  Col,
  Divider,
  Image,
  InputNumber,
  Layout,
  message,
  Row,
} from "antd";
import { useCallback, useEffect, useMemo, useState } from "react";
import { RPCEndpoint } from "../pages";
import { IDL } from "./credix";
import { CredixPass, CredixProgram } from "./idl.types";
import {
  findProgramAddressSync,
  Logger,
  OpenOrdersPda,
  ReferralFees,
} from "./middleware";
import { MarketProxy, MarketProxyBuilder } from "./serum";
import { CivicStuff } from "./CivicStuff";
import _ from "lodash";

require("@solana/wallet-adapter-react-ui/styles.css");

enum OrderType {
  BUY,
  SELL,
}

interface Order {
  size: number;
  price: number;
  type: OrderType;
}

const GATEWAY_PROGRAM: PublicKey = new PublicKey(
  "gatem74V238djXdzWnJf94Wo1DcnuGkfijbf3AuBhfs"
);

function encode(input: string): Uint8Array {
  const encoder = new TextEncoder(); // Browser.
  return encoder.encode(input);
}

class CredixPermissionedMarket {
  private dexProgram: PublicKey;
  private programId: PublicKey;
  private lpMint: PublicKey;
  private credixProgram: PublicKey;
  private globalMarketSeed: string;
  private gatewayNetwork: PublicKey;
  constructor(
    dexProgram: PublicKey,
    programId: PublicKey,
    lpMint: PublicKey,
    credixProgram: PublicKey,
    globalMarketSeed: string,
    gatewayNetwork: PublicKey
  ) {
    this.dexProgram = dexProgram;
    this.programId = programId;
    this.lpMint = lpMint;
    this.credixProgram = credixProgram;
    this.globalMarketSeed = globalMarketSeed;
    this.gatewayNetwork = gatewayNetwork;
  }
  initOpenOrders(ix: TransactionInstruction) {
    this.proxy(ix, 3);
  }
  newOrderV3(ix: TransactionInstruction) {
    this.proxy(ix, 7);
  }
  cancelOrderV2(ix: TransactionInstruction) {
    this.proxy(ix, 4);
  }
  cancelOrderByClientIdV2(ix: TransactionInstruction) {
    this.proxy(ix, 4);
  }
  settleFunds(ix: TransactionInstruction) {
    this.proxy(ix, 2);
  }
  closeOpenOrders(ix: TransactionInstruction) {
    this.proxy(ix, 1);
  }
  prune(ix: TransactionInstruction) {
    this.proxy(ix, 3);
  }
  consumeEvents(ix: TransactionInstruction) {
    ix.data = Buffer.concat([Buffer.from([0]), ix.data]);
  }
  consumeEventsPermissioned(ix: TransactionInstruction) {}

  proxy(ix: TransactionInstruction, inititorIndex: number) {
    let initiator: PublicKey = ix.keys[inititorIndex].pubkey;
    let [permissionedMarketPDA, permissionedBump] = findProgramAddressSync(
      [Buffer.from(encode("signing-authority"))],
      this.programId
    );
    let [globalMarketState, _globalMarketStateBump] = findProgramAddressSync(
      [Buffer.from(encode(this.globalMarketSeed))],
      this.credixProgram
    );

    let [signingAuthority, _bump] = findProgramAddressSync(
      [globalMarketState.toBuffer()],
      this.credixProgram
    );

    let [credixPassPda, credixPassPdaBump] = findProgramAddressSync(
      [
        globalMarketState.toBuffer(),
        initiator.toBuffer(),
        Buffer.from(encode("credix-pass")),
      ],
      this.credixProgram
    );
    const GATEWAY_TOKEN_ADDRESS_SEED = "gateway";

    const seeds = [
      initiator.toBuffer(),
      Buffer.from(GATEWAY_TOKEN_ADDRESS_SEED, "utf8"),
      Buffer.from([0, 0, 0, 0, 0, 0, 0, 0]),
      this.gatewayNetwork.toBuffer(),
    ];

    let gateway_account = findProgramAddressSync(seeds, GATEWAY_PROGRAM);
    console.log("proxy gateway", gateway_account[0]);

    let initiator_lpTokenAccount = findProgramAddressSync(
      [
        initiator.toBuffer(),
        TOKEN_PROGRAM_ID.toBuffer(),
        this.lpMint.toBuffer(),
      ],
      ASSOCIATED_TOKEN_PROGRAM_ID
    );

    ix.keys = [
      { pubkey: initiator, isWritable: true, isSigner: true },
      {
        pubkey: initiator_lpTokenAccount[0],
        isWritable: true,
        isSigner: false,
      },
      { pubkey: permissionedMarketPDA, isWritable: false, isSigner: false },
      { pubkey: signingAuthority, isWritable: false, isSigner: false },
      { pubkey: this.lpMint, isWritable: false, isSigner: false },
      { pubkey: globalMarketState, isWritable: false, isSigner: false },
      { pubkey: credixPassPda, isWritable: false, isSigner: false },
      { pubkey: TOKEN_PROGRAM_ID, isWritable: false, isSigner: false },
      { pubkey: this.credixProgram, isWritable: false, isSigner: false },
      {
        pubkey: ASSOCIATED_TOKEN_PROGRAM_ID,
        isWritable: false,
        isSigner: false,
      },
      { pubkey: SystemProgram.programId, isWritable: false, isSigner: false },
      { pubkey: SYSVAR_RENT_PUBKEY, isWritable: false, isSigner: false },
      { pubkey: gateway_account[0], isWritable: false, isSigner: false },
      ...ix.keys,
    ];
    ix.data = Buffer.concat([Buffer.from([permissionedBump]), ix.data]);
  }
}

const marketAddress = new PublicKey(
  // "3gudbK5W1gxJc4ArDwKNYegisf4J3aD6p1yytQeb8yhm"
  "Gviq65G8UfnRRqvT4ufLA7KCLTD83qL79r2BvnNwixPG"
);

const permissionedMarketProgram = new PublicKey(
  "GuPsqCV7H2bw35UFBHvmzNgK28qVe92U5vq7JJigjPUv"
);

const DEX_PID = new PublicKey("A3KCE92wXZMtGGJT6XYL2KHva58VXvWkhcqfJ6Q5JEia");

const referral = new PublicKey("EoYuxcwTfyznBF2ebzZ8McqvveyxtMNTGAXGmNKycchB");

interface IdentityProps {
  gatekeeper: PublicKey | null;
}

export const IdentityButton = (props: IdentityProps) => {
  console.log("prop", props.gatekeeper?.toString());
  const wallet = useAnchorWallet();
  return (
    <>
      <GatewayProvider
        wallet={wallet}
        stage={"preprod"}
        gatekeeperNetwork={props.gatekeeper || undefined}
        clusterUrl={RPCEndpoint}
      >
        {props.gatekeeper && (
          <CivicStuff gatekeeperNetwork={props.gatekeeper} />
        )}
      </GatewayProvider>
    </>
  );
};

export const Dex = () => {
  const [limitPrice, setLimitPrice] = useState<number>();
  const [amount, setAmount] = useState<number>();
  const [buyTabActive, setBuyTabActive] = useState<boolean>(true);
  const { Header, Content } = Layout;
  const [orders, setOrders] = useState<Order[]>();
  const [usdcBalance, setUSDCBalance] = useState<string>();
  const [civicPass, setCivicPass] = useState<GatewayToken>();
  const [depositAmount, setDepositAmount] = useState<number>();
  const [credixPDA, setCredixPDA] = useState<PublicKey>();
  const [credixPass, setCredixPass] = useState<CredixPass>();
  const [lpBalance, setLPBalance] = useState<string>();
  const [serumMarket, setSerumMarket] = useState<MarketProxy>();
  const [gatekeeperNetwork, setGatekeeperNetwork] = useState<PublicKey>();

  const connection = useConnection();
  const anchorWallet = useAnchorWallet();
  const wallet = useWallet();

  const programId = useMemo(
    () => new PublicKey("6i5vHpj1fVDqaWxknwH8mfCjkm2zZVwgDtfPMg19nzQK"),
    []
  );

  const getProgram = useCallback(() => {
    if (anchorWallet) {
      const provider = new Provider(
        connection.connection,
        anchorWallet,
        Provider.defaultOptions()
      );
      const saberProvider = makeSaberProvider(provider);
      return newProgram<CredixProgram>(IDL, programId, saberProvider);
    }
  }, [anchorWallet, programId, connection.connection]);

  const getMarketPDA = useCallback(() => {
    const program = getProgram();

    if (!program) {
      return;
    }

    const seed = Buffer.from(utils.bytes.utf8.encode("credix-market"));
    return PublicKey.findProgramAddress([seed], programId);
  }, [getProgram, programId]);

  const getSigningAuthority = async () => {
    const marketPDa = await getMarketPDA();

    if (!marketPDa) {
      return;
    }

    const seed = [marketPDa[0].toBuffer()];
    return PublicKey.findProgramAddress(seed, programId);
  };

  const getUSDCBalance = useCallback(async () => {
    console.log("getting balance");
    if (anchorWallet) {
      console.log("asdfs");
      const program = getProgram();

      if (!program) {
        console.log("no progrm");
        return;
      }
      console.log("asdfs");

      const marketPDA = await getMarketPDA();

      if (!marketPDA) {
        return;
      }
      console.log("asdfs");

      const market = await program.account.globalMarketState.fetchNullable(
        marketPDA[0]
      );

      console.log("asdfs");

      if (market) {
        console.log("market found");
        const baseMint = market.liquidityPoolTokenMintAccount;
        try {
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
        } catch (e) {
          console.log(e);
        }

        console.log("set usdc");

        const gatekeeperNetwork = market.gatekeeperNetwork;
        setGatekeeperNetwork(gatekeeperNetwork);
        const gatewayToken = await findGatewayToken(
          connection.connection,
          anchorWallet.publicKey,
          gatekeeperNetwork
        );

        setCivicPass(gatewayToken || undefined);
        console.log("set civic", gatewayToken?.publicKey);

        const credixSeed = Buffer.from(utils.bytes.utf8.encode("credix-pass"));
        const credixSeeds = [
          marketPDA[0].toBuffer(),
          anchorWallet.publicKey.toBuffer(),
          credixSeed,
        ];
        const credixPDA = await PublicKey.findProgramAddress(
          credixSeeds,
          programId
        );

        setCredixPDA(credixPDA[0]);
        console.log("set credix pda");

        const cPass = await program.account.credixPass.fetchNullable(
          credixPDA[0]
        );
        setCredixPass(cPass || undefined);
        console.log("set pass");

        const lpMint = market.lpTokenMintAccount;
        try {
          const lpTokenAddress = await Token.getAssociatedTokenAddress(
            ASSOCIATED_TOKEN_PROGRAM_ID,
            TOKEN_PROGRAM_ID,
            lpMint,
            anchorWallet.publicKey
          );
          console.log("asdfasfd", lpTokenAddress.toString());
          const lpAmount =
            await program.provider.connection.getTokenAccountBalance(
              lpTokenAddress
            );
          setLPBalance(lpAmount.value.uiAmountString);
          console.log("set lp balance");
        } catch (e) {
          console.log(e);
        }
      }
    }
  }, [
    anchorWallet,
    connection.connection,
    getProgram,
    getMarketPDA,
    programId,
  ]);

  const createOrder = async () => {
    console.log("order", buyTabActive, amount, limitPrice);

    if (!amount) {
      return;
    }

    if (!limitPrice) {
      return;
    }

    if (!serumMarket) {
      return;
    }

    if (!anchorWallet) {
      return;
    }

    const program = getProgram();
    if (!program) {
      console.log("no program");
      return;
    }
    const marketPDA = await getMarketPDA();

    if (!marketPDA) {
      console.log("no market pda");
      return;
    }
    const market = await program.account.globalMarketState.fetchNullable(
      marketPDA[0]
    );

    if (!market) {
      console.log("no market");
      return;
    }

    if (!market) {
      return;
    }

    const baseMint = market.liquidityPoolTokenMintAccount;
    const lpMint = market.lpTokenMintAccount;
    const baseTokenAccount = await Token.getAssociatedTokenAddress(
      ASSOCIATED_TOKEN_PROGRAM_ID,
      TOKEN_PROGRAM_ID,
      baseMint,
      anchorWallet.publicKey
    );
    const lpTokenAccount = await Token.getAssociatedTokenAddress(
      ASSOCIATED_TOKEN_PROGRAM_ID,
      TOKEN_PROGRAM_ID,
      lpMint,
      anchorWallet.publicKey
    );
    const openOrder = await OpenOrdersPda.openOrdersAddress(
      marketAddress,
      anchorWallet.publicKey,
      DEX_PID,
      serumMarket.proxyProgramId
    );

    const ix = serumMarket.instruction.newOrderV3({
      owner: anchorWallet.publicKey,
      payer: buyTabActive ? baseTokenAccount : lpTokenAccount,
      side: buyTabActive ? "buy" : "sell",
      price: limitPrice,
      openOrdersAddressKey: openOrder,
      size: amount,
      orderType: "limit",
      selfTradeBehavior: "decrementTake",
    });

    const referralUsdc = await Token.getAssociatedTokenAddress(
      ASSOCIATED_TOKEN_PROGRAM_ID,
      TOKEN_PROGRAM_ID,
      baseMint,
      referral
    );

    let ix2 = serumMarket.instruction.settleFunds(
      openOrder,
      anchorWallet.publicKey,
      lpTokenAccount,
      baseTokenAccount,
      referralUsdc
    );

    if (!wallet.publicKey) {
      return;
    }

    let tx = new Transaction();
    tx.add(ix);
    let blockhash = (await connection.connection.getRecentBlockhash())
      .blockhash;
    tx.recentBlockhash = blockhash;
    tx.feePayer = wallet.publicKey;
    tx = await anchorWallet.signTransaction(tx);

    console.log("sending");
    const txSigPromise = connection.connection.sendRawTransaction(
      tx.serialize()
    );
    // const txSigPromise = wallet.sendTransaction(tx, connection.connection);
    console.log("send order");
    message.info("Placing order");
    let txSig = await txSigPromise;
    await connection.connection.confirmTransaction(txSig);
    message.success("Order placed");
    console.log("TADAA");

    let tx2 = new Transaction();
    tx2.add(ix2);
    blockhash = (await connection.connection.getRecentBlockhash()).blockhash;
    tx2.recentBlockhash = blockhash;
    tx2.feePayer = wallet.publicKey;

    tx2 = await anchorWallet.signTransaction(tx2);

    message.info("Settling funds");
    txSig = await connection.connection.sendRawTransaction(tx2.serialize());
    await connection.connection.confirmTransaction(txSig);
    message.success("Funds settled");
  };

  useEffect(() => {
    getUSDCBalance();
  }, [getUSDCBalance]);

  const createOpenOrdersPDA = async () => {
    if (!wallet.publicKey) {
      return;
    }

    if (!serumMarket) {
      return;
    }

    if (!anchorWallet) {
      return;
    }

    const openOrder = await OpenOrdersPda.openOrdersAddress(
      marketAddress,
      wallet.publicKey,
      DEX_PID,
      serumMarket.proxyProgramId
    );
    const openOrdersAccountInfo = await connection.connection.getAccountInfo(
      openOrder
    );

    if (!openOrdersAccountInfo) {
      message.info("Creating open orders PDA");
      const ix = serumMarket.instruction.initOpenOrders(
        wallet.publicKey,
        serumMarket.market.address,
        serumMarket.market.address,
        serumMarket.market.address
      );
      let tx = new Transaction();
      tx.add(ix);
      let { blockhash } = await connection.connection.getRecentBlockhash();
      tx.recentBlockhash = blockhash;
      tx.feePayer = wallet.publicKey;
      tx = await anchorWallet.signTransaction(tx);
      console.log("signatures, ", tx.signatures);
      const sig = await connection.connection.sendRawTransaction(
        tx.serialize()
      );
      await connection.connection.confirmTransaction(sig);
      message.success("Open orders pda created");
    }
  };

  const deposit = async () => {
    const program = getProgram();
    const marketPDA = await getMarketPDA();
    const signingAuthority = await getSigningAuthority();

    if (!signingAuthority) {
      console.log("no auth");
      return;
    }

    if (!marketPDA) {
      console.log("no market pda");
      return;
    }

    if (!program) {
      console.log("no program");
      return;
    }

    if (!depositAmount) {
      console.log("no deposit");
      return;
    }

    if (!anchorWallet) {
      console.log("no wallet");
      return;
    }

    if (!civicPass) {
      console.log("no civic");
      return;
    }

    const market = await program.account.globalMarketState.fetchNullable(
      marketPDA[0]
    );

    if (!market) {
      console.log("no market");
      return;
    }

    const baseMint = market.liquidityPoolTokenMintAccount;
    const baseTokenAddress = await Token.getAssociatedTokenAddress(
      ASSOCIATED_TOKEN_PROGRAM_ID,
      TOKEN_PROGRAM_ID,
      baseMint,
      anchorWallet.publicKey
    );

    const lpMint = market.lpTokenMintAccount;
    const lpTokenAddress = await Token.getAssociatedTokenAddress(
      ASSOCIATED_TOKEN_PROGRAM_ID,
      TOKEN_PROGRAM_ID,
      lpMint,
      anchorWallet.publicKey
    );

    const liquidityPoolTokenAccount = await Token.getAssociatedTokenAddress(
      ASSOCIATED_TOKEN_PROGRAM_ID,
      TOKEN_PROGRAM_ID,
      baseMint,
      signingAuthority[0],
      true
    );

    if (!credixPDA) {
      console.log("no credix pda");
      return;
    }

    const d = new BN(depositAmount * 10 ** 6);
    const promise = program.rpc.depositFunds(d, {
      accounts: {
        investor: anchorWallet.publicKey,
        gatewayToken: civicPass.publicKey,
        globalMarketState: marketPDA[0],
        signingAuthority: signingAuthority[0],
        investorTokenAccount: baseTokenAddress,
        liquidityPoolTokenAccount: liquidityPoolTokenAccount,
        lpTokenMintAccount: lpMint,
        investorLpTokenAccount: lpTokenAddress,
        baseMintAccount: baseMint,
        tokenProgram: TOKEN_PROGRAM_ID,
        credixPass: credixPDA,
        systemProgram: SystemProgram.programId,
        rent: SYSVAR_RENT_PUBKEY,
        associatedTokenProgram: ASSOCIATED_TOKEN_PROGRAM_ID,
      },
    });

    message.info("Depositing funds");
    await promise;
    message.success("Funds deposited");
  };

  const loadSerumMarket = useCallback(async () => {
    const marketPDA = await getMarketPDA();
    const program = getProgram();

    if (!marketPDA) {
      console.log("no market pda");
      return;
    }

    if (!program) {
      console.log("no program");
      return;
    }

    const market = await program.account.globalMarketState.fetchNullable(
      marketPDA[0]
    );

    if (!market) {
      console.log("no market");
      return;
    }

    if (!anchorWallet) {
      console.log("no wallet");
      return;
    }

    const lpMint = market.lpTokenMintAccount;

    console.log("sdfdsaf", marketPDA[0].toString());
    const mmm = await program.provider.connection.getAccountInfo(marketAddress);
    console.log(
      "Sfasfdads",
      mmm && mmm.owner.toString(),
      marketAddress.toString()
    );
    const gm = await program.account.globalMarketState.fetch(marketPDA[0]);
    const m = await new MarketProxyBuilder()
      .middleware(
        new OpenOrdersPda({
          proxyProgramId: permissionedMarketProgram,
          dexProgramId: DEX_PID,
        })
      )
      .middleware(new ReferralFees())
      .middleware(
        new CredixPermissionedMarket(
          DEX_PID,
          permissionedMarketProgram,
          lpMint,
          programId,
          "credix-market",
          gm.gatekeeperNetwork
        )
      )
      .middleware(new Logger())
      .load({
        connection: connection.connection,
        market: marketAddress,
        dexProgramId: DEX_PID,
        proxyProgramId: permissionedMarketProgram,
        options: { commitment: "recent" },
      });

    setSerumMarket(m);
  }, [
    anchorWallet,
    connection.connection,
    getMarketPDA,
    getProgram,
    programId,
  ]);

  useEffect(() => {
    loadSerumMarket();
  }, [loadSerumMarket]);

  const loadOrders = useCallback(async () => {
    if (!serumMarket) {
      return;
    }

    const asks = await serumMarket.market.loadAsks(connection.connection);
    const bids = await serumMarket.market.loadBids(connection.connection);

    const orders = [];

    // @ts-ignore
    for (let order of asks) {
      orders.push({
        size: order.size,
        price: order.price,
        type: order.side === "buy" ? OrderType.BUY : OrderType.SELL,
      });
    }

    // @ts-ignore
    for (let order of bids) {
      orders.push({
        size: order.size,
        price: order.price,
        type: order.side === "buy" ? OrderType.BUY : OrderType.SELL,
      });
    }

    setOrders(orders);
  }, [connection.connection, serumMarket]);

  useEffect(() => {
    loadOrders();
  }, [loadOrders]);

  const issueCredixPass = async () => {
    const marketPDA = await getMarketPDA();
    const program = getProgram();

    if (!marketPDA) {
      console.log("no market pda");
      return;
    }

    if (!program) {
      console.log("no program");
      return;
    }

    if (!anchorWallet) {
      console.log("no wallet");
      return;
    }

    const credixSeed = Buffer.from(utils.bytes.utf8.encode("credix-pass"));
    const credixSeeds = [
      marketPDA[0].toBuffer(),
      anchorWallet.publicKey.toBuffer(),
      credixSeed,
    ];
    const credixPDA = await PublicKey.findProgramAddress(
      credixSeeds,
      programId
    );

    console.log("sdfas");
    try {
      const txPromise = program.rpc.createCredixPass(credixPDA[1], true, true, {
        accounts: {
          owner: anchorWallet.publicKey,
          passHolder: anchorWallet.publicKey,
          globalMarketState: marketPDA[0],
          credixPass: credixPDA[0],
          systemProgram: SystemProgram.programId,
          rent: SYSVAR_RENT_PUBKEY,
        },
        signers: [],
      });
      message.info("Creating Credix pass");
      const txSig = await txPromise;
      await connection.connection.confirmTransaction(txSig);
      message.success("Credix pass created");
      console.log("newly made credix pass", credixPDA[0].toString());
      const pass = await program.account.credixPass.fetch(credixPDA[0]);
      setCredixPass(pass || undefined);
    } catch (e) {
      alert(e);
    }
  };

  const issueCivicPass = async () => {
    if (!anchorWallet) {
      return;
    }

    const program = getProgram();
    if (!program) {
      console.log("no program");
      return;
    }
    const marketPDA = await getMarketPDA();

    if (!marketPDA) {
      console.log("no market pda");
      return;
    }
    const market = await program.account.globalMarketState.fetchNullable(
      marketPDA[0]
    );

    if (!market) {
      return;
    }
    const issueVanillaInstruction = await issueVanilla(
      await getGatewayTokenKeyForOwner(
        anchorWallet.publicKey,
        market.gatekeeperNetwork
      ),
      anchorWallet.publicKey,
      await getGatekeeperAccountKey(
        anchorWallet.publicKey,
        market.gatekeeperNetwork
      ),
      anchorWallet.publicKey,
      anchorWallet.publicKey,
      market.gatekeeperNetwork
    );

    const tx = new Transaction();
    tx.add(issueVanillaInstruction);

    const txSigPromise = wallet.sendTransaction(tx, connection.connection);
    message.info("Creating Civic pass");
    const txSig = await txSigPromise;

    await connection.connection.confirmTransaction(txSig);
    message.success("Civic pass created");
  };

  return (
    <Layout
      style={{
        height: "100vh",
        padding: "25px",
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
            <IdentityButton gatekeeper={gatekeeperNetwork || null} />
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

      <Content style={{ paddingTop: "25px" }}>
        <Row
          style={{
            height: "100%",
          }}
          gutter={25}
        >
          <Col span={8}>
            <Card
              style={{
                height: "100%",
                padding: 0,
                boxShadow: "0px 0px 10px 1px rgba(0,0,0,0.1)",
              }}
            >
              <div style={{ padding: "25px" }}>
                <h1 style={{ margin: 0 }}>Pass</h1>
              </div>
              <div style={{ padding: "25px", paddingTop: 0 }}>
                <div style={{ display: "flex", flexDirection: "column" }}>
                  <Row>
                    <Col span={12}>
                      <Button
                        size="large"
                        type="primary"
                        block
                        onClick={issueCivicPass}
                        disabled={true}
                      >
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
                        <Checkbox
                          disabled
                          checked={!!civicPass}
                          style={{ marginLeft: "25px" }}
                        />
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
                        onClick={issueCredixPass}
                        //@ts-ignore
                        disabled={credixPass}
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
                        <Checkbox
                          disabled
                          checked={!!credixPass}
                          style={{ marginLeft: "25px" }}
                        />
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
                <h1 style={{ margin: 0 }}>Get LP Tokens</h1>
                <Row>
                  <Col span={6}>
                    <b>USDC balance:</b>
                  </Col>
                  <Col span={5}>
                    {`${usdcBalance ? _.round(Number(usdcBalance), 2) : "0"} USDC`}
                  </Col>
                </Row>
                <Row>
                  <Col span={6}>
                    <b>LP balance:</b>
                  </Col>
                  <Col span={5}>
                    {`${lpBalance ? _.round(Number(lpBalance), 2) : "0"} LP`}
                  </Col>
                </Row>
              </div>
              <div style={{ padding: "25px", paddingTop: 0 }}>
                <Row gutter={25}>
                  <Col span={18}>
                    <InputNumber
                      size="large"
                      addonAfter="USDC"
                      style={{ width: "100%" }}
                      onChange={(v) => setDepositAmount(Number(v))}
                    />
                  </Col>
                  <Col span={6}>
                    <Button size="large" type="primary" block onClick={deposit}>
                      Get LP
                    </Button>
                  </Col>
                </Row>
              </div>
              <div
                style={{
                  padding: "25px",
                  borderTop: "2px solid rgb(240, 242, 245, 0.85)",
                }}
              >
                <h1 style={{ margin: 0 }}>Create open orders PDA</h1>
              </div>
              <div style={{ padding: "25px", paddingTop: 0 }}>
                <Row gutter={25}>
                  <Col span={24}>
                    <Button
                      size="large"
                      type="primary"
                      block
                      onClick={createOpenOrdersPDA}
                    >
                      Create open orders PDA
                    </Button>
                  </Col>
                </Row>
              </div>
            </Card>
          </Col>

          <Col span={8}>
            <Card
              style={{
                height: "100%",
                padding: 0,
                boxShadow: "0px 0px 10px 1px rgba(0,0,0,0.1)",
              }}
            >
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
                            addonBefore="Amount"
                            addonAfter="LP"
                            onChange={(val) => setAmount(Number(val))}
                          ></InputNumber>
                        </div>
                        <div style={{ marginTop: "25px" }}>
                          <InputNumber
                            style={{ width: "100%" }}
                            size="large"
                            addonBefore="Limit price"
                            addonAfter="USDC"
                            onChange={(val) => setLimitPrice(Number(val))}
                          ></InputNumber>
                        </div>
                      </div>
                    </Col>
                  </Row>
                  <Row>
                    <Col span={24}>
                      <div style={{ padding: "25px", paddingTop: 0 }}>
                        <Button
                          size="large"
                          block
                          type="primary"
                          onClick={createOrder}
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
            <Card
              style={{
                height: "100%",
                padding: 0,
                boxShadow: "0px 0px 10px 1px rgba(0,0,0,0.1)",
              }}
            >
              <div style={{ padding: "25px" }}>
                <h1 style={{ margin: 0 }}>Order book</h1>
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
                      <h4 style={{ margin: 0, display: "inline" }}>Sell</h4>
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
                {orders &&
                  orders
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
                              <div style={{ color: "red" }}>
                                {_.round(o.price, 3)}
                              </div>
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
                      <h4 style={{ margin: 0, display: "inline" }}>Buy</h4>
                    </div>
                  </Col>
                </Row>
                {orders &&
                  orders
                    .filter((o) => o.type === OrderType.BUY)
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
                              <div style={{ color: "green" }}>
                                {_.round(o.price, 3)}
                              </div>
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
