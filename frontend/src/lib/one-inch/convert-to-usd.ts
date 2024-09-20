import { mainnet } from "viem/chains";
import { supportedchains } from "../constants";
import { PriceResponse } from "../type";
import { formatEther } from "viem";
import { roundUpToFiveDecimals } from "../utils";

export default function convertToUsd(
  prices: PriceResponse[],
  chainId: number,
  token: string,
  amount: string
) {
  return roundUpToFiveDecimals(
    (
      parseFloat(
        formatEther(
          BigInt(
            prices[chainId == mainnet.id ? 0 : 1].data[
              supportedchains[chainId].tokens[token]
            ]
          )
        )
      ) * parseFloat(amount)
    ).toString()
  );
}
