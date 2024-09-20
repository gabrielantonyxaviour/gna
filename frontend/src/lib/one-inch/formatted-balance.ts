import { formatEther } from "viem";
import { BalanceResponse } from "../type";
import { roundUpToFiveDecimals } from "../utils";
import { supportedchains } from "../constants";

export default function formattedBalance(
  balances: BalanceResponse[],
  chainId: number,
  token: string
) {
  return roundUpToFiveDecimals(
    formatEther(
      BigInt(
        balances[chainId == 1 ? 0 : 1].data[
          supportedchains[chainId].tokens[token]
        ]
      )
    )
  );
}
