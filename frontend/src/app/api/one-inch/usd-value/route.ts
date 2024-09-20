"use server";
import axios from "axios";
import { supportedchains } from "@/lib/constants";
import { NextRequest } from "next/server";

const ONE_INCH_API_KEY = process.env.NEXT_PUBLIC_ONE_INCH_API_KEY || "NOT_SET";

export async function GET(req: NextRequest, res: Response) {
  const searchParams = req.nextUrl.searchParams;
  const chain = searchParams.get("chain") || "0x";

  if (ONE_INCH_API_KEY === "NOT_SET")
    return Response.json({
      success: false,
      error: "ONE INCH API KEY not set.",
    });

  const url = `https://api.1inch.dev/price/v1.1/${chain}`;

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
    const response = await axios.post(url, body, config);

    console.log(response.data);

    return Response.json({
      success: true,
      data: response.data,
    });
  } catch (error) {
    console.error(error);
  }
}
