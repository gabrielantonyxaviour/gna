"use server";
import { NextRequest } from "next/server";
import { FusionSDK, NetworkEnum } from "@1inch/fusion-sdk";

const ONE_INCH_API_KEY = process.env.NEXT_PUBLIC_ONE_INCH_API_KEY || "NOT_SET";

export async function POST(req: NextRequest, res: Response) {
  try {
    const { fromTokenAddress, toTokenAddress, amount, walletAddress } =
      await req.json();

    const gnosisSdk = new FusionSDK({
      url: "https://api.1inch.dev/fusion",
      network: NetworkEnum.GNOSIS,
      authKey: ONE_INCH_API_KEY,
    });

    console.log(ONE_INCH_API_KEY);

    const latest = await gnosisSdk.placeOrder({
      fromTokenAddress,
      toTokenAddress,
      amount,
      walletAddress,
    });

    console.log(latest);

    return Response.json({
      success: true,
      data: "latest",
    });
  } catch (e: any) {
    console.log(e);
    return Response.json({
      success: false,
      data: e.toString(),
    });
  }
}
