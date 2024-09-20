import { ChevronDown, ChevronUp } from "lucide-react";
import { Input } from "@/components/ui/input";
import { supportedchains, supportedcoins } from "@/lib/constants";
import { Card, CardContent, CardFooter, CardTitle } from "@/components/ui/card";
import {
  Menubar,
  MenubarContent,
  MenubarItem,
  MenubarMenu,
  MenubarTrigger,
} from "@/components/ui/menubar";
import Image from "next/image";
import { useAccount } from "wagmi";
import { useState } from "react";
import { gnosis, mainnet } from "viem/chains";
import { useEnvironmentContext } from "@/components/context";
import convertToUsd from "@/lib/one-inch/convert-to-usd";
export default function From({
  fromAmount,
  setFromAmount,
  fromToken,
  setFromToken,
  fromBalance,
  toToken,
}: {
  toToken: string;
  fromAmount: string;
  fromBalance: string;
  setFromAmount: (fromAmount: string) => void;
  fromToken: string;
  setFromToken: (fromToken: string) => void;
}) {
  const { chainId } = useAccount();
  const [chevron, setChevron] = useState(true);
  const { prices } = useEnvironmentContext();
  return (
    <Card className="w-full py-4 px-2  border-none ">
      <CardTitle>
        <div className="flex justify-between px-3 pb-1">
          <p className="text-sm text-muted-foreground font-medium ">You pay</p>
          <p className="text-sm text-muted-foreground font-medium ">
            Balance: {fromBalance}{" "}
            <span
              className=" pl-2 text-primary font-semibold text-sm cursor-pointer select-none"
              onClick={() => {
                setFromAmount(fromBalance);
              }}
            >
              MAX
            </span>
          </p>
        </div>
      </CardTitle>
      <CardContent className="flex justify-between p-0">
        <Menubar
          onClick={() => {
            setChevron(!chevron);
          }}
          className="border-none"
        >
          <MenubarMenu>
            <MenubarTrigger
              onClick={() => {
                setChevron(!chevron);
              }}
              className="data-[state=open]:bg-transparent focus:bg-transparent text-lg font-bold mx-0 px-2"
            >
              <div className=" flex space-x-3 items-center ">
                <Image
                  src={supportedcoins[fromToken].image}
                  width={30}
                  height={30}
                  alt=""
                  className="rounded-full"
                />
                <p>{`${supportedcoins[fromToken].symbol}`}</p>
                {!chevron ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
              </div>
            </MenubarTrigger>
            <MenubarContent>
              <MenubarItem
                disabled={toToken == "eth" || toToken == "xdai"}
                onClick={() => {
                  setFromToken(chainId == mainnet.id ? "eth" : "xdai");
                  setChevron(true);
                }}
              >
                <div className="flex space-x-2">
                  <Image
                    src={
                      supportedcoins[chainId == mainnet.id ? "eth" : "xdai"]
                        .image
                    }
                    width={30}
                    height={30}
                    alt=""
                    className="rounded-full"
                  />
                  <p className="text-lg font-semibold">
                    {
                      supportedcoins[chainId == mainnet.id ? "eth" : "xdai"]
                        .symbol
                    }
                  </p>
                </div>
              </MenubarItem>
              {chainId == gnosis.id && (
                <>
                  <MenubarItem
                    disabled={toToken == "wxdai"}
                    onClick={() => {
                      setFromToken("wxdai");
                      setChevron(true);
                    }}
                  >
                    <div className="flex space-x-2">
                      <Image
                        src={supportedcoins["wxdai"].image}
                        width={30}
                        height={30}
                        alt=""
                        className="rounded-full"
                      />
                      <p className="text-lg font-semibold">
                        {supportedcoins["wxdai"].symbol}
                      </p>
                    </div>
                  </MenubarItem>
                  <MenubarItem
                    disabled={toToken == "gnosis"}
                    onClick={() => {
                      setFromToken("gnosis");
                      setChevron(true);
                    }}
                  >
                    <div className="flex space-x-2">
                      <Image
                        src={supportedcoins["gnosis"].image}
                        width={30}
                        height={30}
                        alt=""
                        className="rounded-full"
                      />
                      <p className="text-lg font-semibold">
                        {supportedcoins["gnosis"].symbol}
                      </p>
                    </div>
                  </MenubarItem>
                </>
              )}
              {Object.entries(supportedcoins)
                .slice(4, 8)
                .map(([coinId, coin]) => (
                  <MenubarItem
                    disabled={coinId == toToken}
                    onClick={() => {
                      setFromToken(coinId);
                      setChevron(true);
                    }}
                  >
                    <div className="flex space-x-2 items-center">
                      <Image
                        src={coin.image}
                        width={30}
                        height={30}
                        alt=""
                        className="rounded-full"
                      />
                      <p className="font-semibold text-lg">{coin.symbol}</p>
                    </div>
                  </MenubarItem>
                ))}
            </MenubarContent>
          </MenubarMenu>
        </Menubar>
        <Input
          className="font-semibold focus-visible:ring-0 focus-visible:outline-none focus-visible:ring-offset-0 bg-transparent border-none w-[50%] text-right text-xl"
          value={fromAmount}
          onChange={(e) => {
            const decimalRegex = /^\d+(\.\d*)?$/;
            if (decimalRegex.test(e.target.value) || e.target.value == "")
              setFromAmount(e.target.value);
          }}
        />
      </CardContent>

      <CardFooter className="px-3 pb-0 pt-2 text-sm flex justify-between text-muted-foreground">
        <p className=" font-medium ">{supportedcoins[fromToken].name}</p>

        <p className="text-end font-medium">
          ~${convertToUsd(prices, gnosis.id, fromToken, fromBalance)}{" "}
        </p>
      </CardFooter>
    </Card>
  );
}
