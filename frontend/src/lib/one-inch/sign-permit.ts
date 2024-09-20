import { parseEther, WalletClient } from "viem";
import { supportedchains } from "../constants";
import { signTypedData } from "viem/accounts";

interface SignPermitProps {
  walletClient: WalletClient;
  chainId: number;
  maker: string;
  makerAsset: string;
  takerAsset: string;
  makingAmount: string;
  takingAmount: string;
  receiver: string;
}

export default async function signPermit({
  walletClient,
  chainId,
  maker,
  makerAsset,
  takerAsset,
  makingAmount,
  takingAmount,
  receiver,
}: SignPermitProps): Promise<{ signature: `0x${string}` }> {
  const domain = {
    name: process.env.NEXT_PUBLIC_HOST || "http://localhost:3000",
    version: "1",
    chainId: chainId, // Assuming Ethereum mainnet
    verifyingContract: supportedchains[chainId].oneInchVerifierContract,
  };
  const types = {
    Order: [
      { name: "Maker", type: "address" },
      { name: "MakerAsset", type: "address" },
      { name: "TakerAsset", type: "address" },
      { name: "MakerTraits", type: "uint256" },
      { name: "Salt", type: "uint256" },
      { name: "MakingAmount", type: "uint256" },
      { name: "TakingAmount", type: "uint256" },
      { name: "Receiver", type: "address" },
    ],
  };

  const value = {
    Maker: maker,
    MakerAsset: makerAsset,
    TakerAsset: takerAsset,
    MakerTraits: BigInt(
      "62419173104490761595518734106457236408761197001521552255135254228693787082752"
    ),
    Salt: BigInt(Date.now()),
    MakingAmount: BigInt(makingAmount),
    TakingAmount: BigInt(takingAmount),
    Receiver: receiver,
  };
  try {
    const signature = await walletClient.signTypedData({
      account: maker as `0x${string}`,
      domain,
      types,
      primaryType: "Order",
      message: value,
    });

    return { signature };
  } catch (e) {
    console.log(e);
    return { signature: "0x" };
  }
}
