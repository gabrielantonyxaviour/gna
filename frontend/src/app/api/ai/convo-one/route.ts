"use server";
import axios from "axios";
import { supportedchains } from "@/lib/constants";
import { NextRequest } from "next/server";


export async function GET(req: NextRequest, res: Response) {
  const searchParams = req.nextUrl.searchParams;
  const query = searchParams.get("query") || "0x";

  try {
    const response = await axios.get("https://wapo-testnet.phala.network/ipfs/QmUXrDS58hYgHzeYyzhBJ1t1G5Sfcb2fMN6v7WjQYDXeQn?chatQuery=" + query);

    console.log(response.data);

    return Response.json({
      success: true,
      data: response.data,
    });
  } catch (error) {
    console.error(error);
  }
}
