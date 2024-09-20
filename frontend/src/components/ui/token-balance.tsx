import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { supportedchains, supportedcoins } from "@/lib/constants";
import { useEffect } from "react";
import { ScrollArea, ScrollBar } from "./scroll-area";

export function TokenBalance({
  balances,
  usdBalances,
}: {
  balances: Record<string, string>;
  usdBalances: Record<string, string>;
}) {
  useEffect(() => {
    console.log("TOKEN ABALNCE LOGOGG");
    console.log(balances);
    console.log(usdBalances);
  }, []);
  return (
    <ScrollArea className="h-[15rem] mx-0 px-0 w-full">
      {Object.entries(usdBalances)
        .sort(
          ([, valueA], [, valueB]) => parseFloat(valueB) - parseFloat(valueA)
        )
        .map(([key, value]) => (
          <div key={key} className="flex items-center py-3 px-3">
            <Avatar className="h-9 w-9">
              <AvatarImage src={supportedcoins[key].image} alt="Avatar" />
              <AvatarFallback>OM</AvatarFallback>
            </Avatar>
            <div className="ml-4 space-y-1">
              <p className="text-sm font-medium leading-none">
                {supportedcoins[key].name}
              </p>
              <p className="text-sm text-muted-foreground">
                {supportedcoins[key].symbol}
              </p>
            </div>
            <div className="ml-auto space-y-1 text-right">
              <p className="text-sm font-medium leading-none">
                {balances[key]}
              </p>
              <p className="text-sm text-muted-foreground">${value}</p>
            </div>
          </div>
        ))}
      {/* <div className="flex items-center">
        <Avatar className="h-9 w-9">
          <AvatarImage src="/coins/bnb.png" alt="Avatar" />
          <AvatarFallback>OM</AvatarFallback>
        </Avatar>
        <div className="ml-4 space-y-1">
          <p className="text-sm font-medium leading-none">
            Binance Smart Chain
          </p>
          <p className="text-sm text-muted-foreground">BNB</p>
        </div>
        <div className="ml-auto space-y-1 text-right">
          <p className="text-sm font-medium leading-none">{balances.bnb}</p>
          <p className="text-sm text-muted-foreground">${usdBalances.bnb}</p>
        </div>
      </div>
      <div className="flex items-center">
        <Avatar className="flex h-9 w-9 items-center justify-center space-y-0 border">
          <AvatarImage src="/coins/usdt.png" alt="Avatar" />
          <AvatarFallback>JL</AvatarFallback>
        </Avatar>
        <div className="ml-4 space-y-1">
          <p className="text-sm font-medium leading-none">Tether USD</p>
          <p className="text-sm text-muted-foreground">USDT</p>
        </div>
        <div className="ml-auto space-y-1 text-right">
          <p className="text-sm font-medium leading-none">{balances.usdt}</p>
          <p className="text-sm text-muted-foreground">${usdBalances.usdt}</p>
        </div>
      </div>
      <div className="flex items-center">
        <Avatar className="h-9 w-9">
          <AvatarImage src="/coins/usdc.png" alt="Avatar" />
          <AvatarFallback>IN</AvatarFallback>
        </Avatar>
        <div className="ml-4 space-y-1">
          <p className="text-sm font-medium leading-none">Stablecoin USD</p>
          <p className="text-sm text-muted-foreground">USDC</p>
        </div>
        <div className="ml-auto space-y-1 text-right">
          <p className="text-sm font-medium leading-none">{balances.usdc}</p>
          <p className="text-sm text-muted-foreground">${usdBalances.usdc}</p>
        </div>
      </div> */}
    </ScrollArea>
  );
}
