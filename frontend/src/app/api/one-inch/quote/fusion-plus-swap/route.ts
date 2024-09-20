"use server";
import axios from "axios";
import { NextRequest } from "next/server";

const ONE_INCH_API_KEY = process.env.NEXT_PUBLIC_ONE_INCH_API_KEY || "NOT_SET";

export async function POST(req: NextRequest, res: Response) {
  const chain = "1";

  if (ONE_INCH_API_KEY === "NOT_SET")
    return Response.json({
      success: false,
      error: "ONE INCH API KEY not set.",
    });

  const url = `https://api.1inch.dev/gas-price/v1.5/${chain}`;

  const config = {
    headers: {
      Authorization: "Bearer " + ONE_INCH_API_KEY,
    },
    params: {},
    paramsSerializer: {
      indexes: null,
    },
  };

  try {
    const response = await axios.get(url, config);
    console.log(response.data);

    return Response.json({
      success: true,
      data: response.data,
    });
  } catch (error) {
    console.error(error);
  }
}
