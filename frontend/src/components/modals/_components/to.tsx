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
import Spinner from "@/components/ui/loading";
import { gnosis, mainnet } from "viem/chains";
import convertToUsd from "@/lib/one-inch/convert-to-usd";
import { useEnvironmentContext } from "@/components/context";
export default function To({
  fromToken,
  toAmount,
  toToken,
  setToToken,
  toBalance,
  isLimit,
}: {
  fromToken: string;
  toAmount: string;
  toToken: string;
  toBalance: string;
  setToToken: (toToken: string) => void;
  isLimit: boolean;
}) {
  const { chainId } = useAccount();
  const [toChevron, setToChevron] = useState(true);
  const { prices } = useEnvironmentContext();
  return (
    <Card
      className={`w-full py-4 px-2 ${
        isLimit ? "border-none" : "bg-secondary"
      } `}
    >
      <CardTitle className="">
        <div className="flex justify-between px-3 pb-1">
          <p className="text-sm text-muted-foreground font-medium ">
            You receive
          </p>
          <p className="text-sm text-muted-foreground font-medium ">
            Balance: {toBalance}{" "}
          </p>
        </div>
      </CardTitle>
      <CardContent className="flex justify-between p-0">
        <Menubar
          onClick={() => {
            setToChevron(!toChevron);
          }}
          className="border-none bg-transparent "
        >
          <MenubarMenu>
            <MenubarTrigger
              onClick={() => {
                setToChevron(!toChevron);
              }}
              className="data-[state=open]:bg-transparent focus:bg-transparent text-lg font-bold mx-0 px-2"
            >
              <div className="flex space-x-3 items-center ">
                <Image
                  src={supportedcoins[toToken].image}
                  width={30}
                  height={30}
                  alt=""
                  className="rounded-full"
                />
                <p>{`${supportedcoins[toToken].symbol}`}</p>
                {!toChevron ? (
                  <ChevronUp size={20} />
                ) : (
                  <ChevronDown size={20} />
                )}
              </div>
            </MenubarTrigger>
            <MenubarContent>
              <MenubarItem
                disabled={fromToken == "eth" || fromToken == "xdai"}
                onClick={() => {
                  setToToken(chainId == mainnet.id ? "eth" : "xdai");

                  setToChevron(true);
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
                    disabled={fromToken == "wxdai"}
                    onClick={() => {
                      setToToken("wxdai");
                      setToChevron(true);
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
                    disabled={fromToken == "gnosis"}
                    onClick={() => {
                      setToToken("gnosis");
                      setToChevron(true);
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
                    disabled={coinId == fromToken}
                    onClick={() => {
                      setToToken(coinId);
                      setToChevron(true);
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
                      <p className="text-lg font-semibold">{coin.symbol}</p>
                    </div>
                  </MenubarItem>
                ))}
            </MenubarContent>
          </MenubarMenu>
        </Menubar>

        <Input
          className="font-semibold border-none w-[50%] text-right hover:border-none bg-transparent text-xl"
          disabled
          value={toAmount}
        />
      </CardContent>
      <CardFooter className="px-3 pb-0 text-sm pt-2 flex justify-between text-muted-foreground">
        <p className="font-medium ">{supportedcoins[toToken].name}</p>
        <p className="text-end font-medium">
          ~${convertToUsd(prices, gnosis.id, toToken, toBalance)}
        </p>
      </CardFooter>
    </Card>
  );
}
