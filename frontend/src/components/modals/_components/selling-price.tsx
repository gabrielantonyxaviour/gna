import { useEnvironmentContext } from "@/components/context";
import { Input } from "@/components/ui/input";
import priceIn from "@/lib/one-inch/price-in";
import { RefreshCcw } from "lucide-react";
import { useEffect } from "react";
import { gnosis } from "viem/chains";

interface SellingPriceProps {
  compareToken: boolean;
  setCompareToken: (compareToken: boolean) => void;
  sellingPrice: string;
  setSellingPrice: (sellingPrice: string) => void;
  fromToken: string;
  toToken: string;
}

export default function SellingPrice({
  compareToken,
  setCompareToken,
  sellingPrice,
  setSellingPrice,
  fromToken,
  toToken,
}: SellingPriceProps) {
  const { prices } = useEnvironmentContext();

  useEffect(() => {
    setSellingPrice(
      priceIn({
        prices: prices,
        fromToken: compareToken ? toToken : fromToken,
        toToken: compareToken ? fromToken : toToken,
        fromChainId: gnosis.id,
        toChainId: gnosis.id,
        amount: "1",
      })
    );
  }, [compareToken]);
  return (
    <div className="py-3 px-4 w-[65%] bg-card rounded-xl">
      <div className=" flex justify-between">
        <p className=" text-xs text-muted-foreground">
          Pay {!compareToken ? fromToken.toUpperCase() : toToken.toUpperCase()}{" "}
          at rate
        </p>
        <p
          className="text-xs font-medium text-primary select-none cursor-pointer"
          onClick={() => {
            setSellingPrice(
              priceIn({
                prices: prices,
                fromToken: !compareToken ? fromToken : toToken,
                toToken: !compareToken ? toToken : fromToken,
                fromChainId: gnosis.id,
                toChainId: gnosis.id,
                amount: "1",
              })
            );
          }}
        >
          Set to market
        </p>
      </div>
      <div className="flex justify-between mt-2">
        <Input
          className="font-semibold focus-visible:ring-0 focus-visible:outline-none focus-visible:ring-offset-0 bg-transparent border-none w-[70%] text-xl px-0"
          value={sellingPrice}
          onChange={(e) => {
            const decimalRegex = /^\d+(\.\d*)?$/;
            if (decimalRegex.test(e.target.value) || e.target.value == "")
              setSellingPrice(e.target.value);
          }}
        />
        <div className="my-auto select-none">
          <div
            className="flex items-center space-x-1 cursor-pointer bg-secondary p-[3px] rounded-sm"
            onClick={() => {
              setCompareToken(!compareToken);
            }}
          >
            <p className="text-sm">
              {!compareToken ? toToken.toUpperCase() : fromToken.toUpperCase()}
            </p>{" "}
            <RefreshCcw className="p-0 h-4 w-4" />{" "}
          </div>
        </div>
      </div>
    </div>
  );
}
