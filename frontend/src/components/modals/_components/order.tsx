import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import From from "./from";
import To from "./to";
import { useAccount } from "wagmi";
import Spinner from "@/components/ui/loading";
import { Input } from "@/components/ui/input";
import Image from "next/image";
import { useEffect, useState } from "react";
import { ArrowDown, RefreshCw } from "lucide-react";
import SellingPrice from "@/components/modals/_components/selling-price";
import ExpiresIn from "@/components/modals/_components/expires-in";
import formattedBalance from "@/lib/one-inch/formatted-balance";
import { useEnvironmentContext } from "@/components/context";
import priceIn from "@/lib/one-inch/price-in";
import { gnosis } from "viem/chains";

interface OrderProps {
  fromAmount: string;
  setFromAmount: (fromAmount: string) => void;
  fromToken: string;
  setFromToken: (fromToken: string) => void;
  toToken: string;
  setToToken: (toToken: string) => void;
  toAmount: string;
  setToAmount: (toAmount: string) => void;
  isTestnet: boolean;
}

export default function Order({
  fromAmount,
  setFromAmount,
  fromToken,
  setFromToken,
  toToken,
  setToToken,
  toAmount,
  setToAmount,
  isTestnet,
}: OrderProps) {
  const { chainId } = useAccount();
  const { prices } = useEnvironmentContext();
  const fromBalance = "0";
  const [sellingPrice, setSellingPrice] = useState(
    priceIn({
      prices: prices,
      fromToken: fromToken,
      toToken: toToken,
      fromChainId: gnosis.id,
      toChainId: gnosis.id,
      amount: "1",
    })
  );
  const [compareToken, setCompareToken] = useState(false);
  const sellingPriceLoading = false;
  const [expiresIn, setExpiresIn] = useState("0");
  const { balances } = useEnvironmentContext();

  useEffect(() => {
    if (prices.length == 2)
      setToAmount(
        (
          (parseFloat(fromAmount) * parseFloat(sellingPrice)) /
          parseFloat(sellingPrice)
        ).toString()
      );
  }, [prices, fromAmount]);
  useEffect(() => {
    setSellingPrice(
      priceIn({
        prices: prices,
        fromToken: fromToken,
        toToken: toToken,
        fromChainId: gnosis.id,
        toChainId: gnosis.id,
        amount: "1",
      })
    );
  }, [fromToken, toToken]);
  return chainId == undefined ? (
    <div></div>
  ) : (
    <div>
      <From
        toToken={toToken}
        fromAmount={fromAmount}
        setFromAmount={setFromAmount}
        fromToken={fromToken}
        fromBalance={formattedBalance(balances, 100, fromToken)}
        setFromToken={setFromToken}
      />
      <div className="relative m-0 p-1">
        <div className="absolute bg-slate-700 left-[49%] -top-[100%] rounded-full">
          <ArrowDown
            className="p-[2px] font-bold text-white h-6 w-6 cursor-pointer transition-transform duration-300 hover:rotate-180"
            onClick={() => {
              setFromToken(toToken);
              setToToken(fromToken);
            }}
          />
        </div>
      </div>
      <To
        fromToken={fromToken}
        toAmount={toAmount}
        toToken={toToken}
        setToToken={setToToken}
        toBalance={formattedBalance(balances, 100, toToken)}
        isLimit={true}
      />
      <div className="flex py-2 space-x-2">
        <SellingPrice
          compareToken={compareToken}
          setCompareToken={setCompareToken}
          sellingPrice={sellingPrice}
          setSellingPrice={setSellingPrice}
          fromToken={fromToken}
          toToken={toToken}
        />
        <ExpiresIn expiresIn={expiresIn} setExpiresIn={setExpiresIn} />
      </div>

      <Button
        variant={"default"}
        className="w-full font-bold"
        onClick={() => {
          // triggerAction();
        }}
        disabled={
          false
          // openTransaction ||
          // parseFloat(fromAmount) == 0 ||
          // fromAmount == "" ||
          // parseFloat(fromAmount) > parseFloat(fromBalance)
        }
      >
        {false ? ( // {openTransaction ? (
          <div className="black-spinner"></div>
        ) : parseFloat(fromAmount) == 0 || fromAmount == "" ? (
          "Enter Amount"
        ) : parseFloat(fromAmount) > parseFloat(fromBalance) ? (
          "Insufficient Funds"
        ) : (
          "Swap"
        )}
      </Button>
    </div>
  );
}
