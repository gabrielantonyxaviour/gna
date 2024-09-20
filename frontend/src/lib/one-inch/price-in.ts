import { supportedchains } from "../constants";
import { PriceResponse } from "../type";

export default function priceIn({
  prices,
  fromToken,
  toToken,
  fromChainId,
  toChainId,
  amount,
}: {
  prices: PriceResponse[];
  fromToken: string;
  toToken: string;
  fromChainId: number;
  toChainId: number;
  amount: string;
}) {
  console.log(
    prices[toChainId == 1 ? 0 : 1].data[
      supportedchains[toChainId].tokens[toToken]
    ]
  );
  console.log(
    prices[fromChainId == 1 ? 0 : 1].data[
      supportedchains[fromChainId].tokens[fromToken]
    ]
  );
  return (
    (parseFloat(amount) *
      parseFloat(
        prices[fromChainId == 1 ? 0 : 1].data[
          supportedchains[fromChainId].tokens[fromToken]
        ]
      )) /
    parseFloat(
      prices[toChainId == 1 ? 0 : 1].data[
        supportedchains[toChainId].tokens[toToken]
      ]
    )
  ).toString();
}
