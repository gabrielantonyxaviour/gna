"use server";
import axios from "axios";
import { supportedchains } from "@/lib/constants";
import { NextRequest } from "next/server";

const ONE_INCH_API_KEY = process.env.NEXT_PUBLIC_ONE_INCH_API_KEY || "NOT_SET";

export async function GET(req: NextRequest, res: Response) {
  const searchParams = req.nextUrl.searchParams;
  const walletAddress = searchParams.get("address") || "0x";
  const chain = searchParams.get("chain") || "0x";

  if (ONE_INCH_API_KEY === "NOT_SET")
    return Response.json({
      success: false,
      error: "ONE INCH API KEY not set.",
    });

  const fetchBalanceUrl = `https://api.1inch.dev/balance/v1.2/${chain}/balances/${walletAddress}`;
  // const convertToUsdGnosisUrl = `https://api.1inch.dev/price/v1.1/100`;
  // const convertToUsdEthereumUrl = `https://api.1inch.dev/price/v1.1/1`;

  const config = {
    headers: {
      Authorization: "Bearer " + ONE_INCH_API_KEY,
    },
    params: {},
    paramsSerializer: {
      indexes: null,
    },
  };
  const body = {
    tokens: Object.values(supportedchains[chain].tokens),
  };

  try {
    const response = await axios.post(fetchBalanceUrl, body, config);

    console.log(response.data);

    return Response.json({
      success: true,
      data: response.data,
    });
  } catch (error) {
    console.error(error);
  }
}
