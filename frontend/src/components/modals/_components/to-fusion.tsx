import { ChevronDown, ChevronUp } from "lucide-react";
import { Input } from "@/components/ui/input";
import { supportedcoins } from "@/lib/constants";
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
import { useEffect, useState } from "react";
import Spinner from "@/components/ui/loading";
import { gnosis, mainnet } from "viem/chains";
import { useEnvironmentContext } from "@/components/context";
import convertToUsd from "@/lib/one-inch/convert-to-usd";
import { ScrollArea } from "@/components/ui/scroll-area";

export default function ToFusion({
  fromToken,
  fromChain,
  toAmount,
  toToken,
  setToToken,
  toBalance,
  toChain,
  setToChain,
  isLimit,
}: {
  fromToken: string;
  fromChain: string;
  toAmount: string;
  toToken: string;
  toBalance: string;
  toChain: string;
  setToChain: (toChain: string) => void;
  setToToken: (toToken: string) => void;
  isLimit: boolean;
}) {
  const { chainId } = useAccount();
  const [chevron, setChevron] = useState(true);
  const { prices } = useEnvironmentContext();

  useEffect(() => {
    console.log("TO FUSION");
    console.log({
      fromToken,
      fromChain,
      toAmount,
      toToken,
      setToToken,
      toBalance,
      toChain,
      setToChain,
      isLimit,
    });
  }, [toAmount]);
  return (
    <Card
      className={`w-full py-4 px-2 ${
        isLimit ? "border-none" : "bg-secondary"
      } `}
    >
      <CardTitle>
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
            setChevron(!chevron);
          }}
          className="border-none bg-secondary"
        >
          <MenubarMenu>
            <MenubarTrigger
              onClick={() => {
                setChevron(!chevron);
              }}
              className="data-[state=open]:bg-secondary focus:bg-secondary bg-secondary text-lg font-bold mx-0 px-2"
            >
              <div className=" flex space-x-3 items-center ">
                <div className="relative flex my-auto">
                  <Image
                    src={supportedcoins[toToken].image}
                    width={30}
                    height={30}
                    alt=""
                    className="rounded-full "
                  />
                  <Image
                    src={supportedcoins[toChain].image}
                    width={15}
                    height={15}
                    alt=""
                    className="rounded-full absolute -bottom-1 -left-1 border border-card"
                  />
                </div>
                <div className="flex flex-col">
                  <p className="text-sm font-semibold leading-none text-left">
                    {supportedcoins[toToken].symbol}
                  </p>
                  <p className="text-[11px] font-medium leading-none">
                    on {supportedcoins[toChain].name}
                  </p>
                </div>
                {!chevron ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
              </div>
            </MenubarTrigger>
            <MenubarContent>
              <ScrollArea className="h-[250px]">
                <MenubarItem
                  disabled={fromToken == "eth" && fromChain == "eth"}
                  onClick={() => {
                    setToToken("eth");
                    setChevron(true);
                    setToChain("eth");
                  }}
                >
                  <div className="flex space-x-2 ">
                    <div className="relative flex my-auto">
                      <Image
                        src={supportedcoins["eth"].image}
                        width={30}
                        height={30}
                        alt=""
                        className="rounded-full "
                      />
                      <Image
                        src={supportedcoins["eth"].image}
                        width={15}
                        height={15}
                        alt=""
                        className="rounded-full absolute -bottom-1 -left-1 border border-card"
                      />
                    </div>
                    <div className="flex flex-col">
                      <p className="text-md font-semibold leading-none">
                        {supportedcoins["eth"].symbol}
                      </p>
                      <p className="text-[11px]">on Ethereum</p>
                    </div>
                  </div>
                </MenubarItem>

                {Object.entries(supportedcoins)
                  .slice(4, 7)
                  .map(([coinId, coin]) => (
                    <MenubarItem
                      disabled={coinId == fromToken && fromChain == "eth"}
                      onClick={() => {
                        setToToken(coinId);
                        setToChain("eth");
                        setChevron(true);
                      }}
                    >
                      <div className="flex space-x-2 ">
                        <div className="relative flex my-auto">
                          <Image
                            src={coin.image}
                            width={30}
                            height={30}
                            alt=""
                            className="rounded-full "
                          />
                          <Image
                            src={supportedcoins["eth"].image}
                            width={15}
                            height={15}
                            alt=""
                            className="rounded-full absolute -bottom-1 -left-1 border border-card"
                          />
                        </div>
                        <div className="flex flex-col">
                          <p className="text-md font-semibold leading-none">
                            {coin.symbol}
                          </p>
                          <p className="text-[11px]">on Ethereum</p>
                        </div>
                      </div>
                    </MenubarItem>
                  ))}
                <MenubarItem
                  disabled={fromToken == "xdai" && fromChain == "gnosis"}
                  onClick={() => {
                    setToToken("xdai");
                    setChevron(true);
                    setToChain("gnosis");
                  }}
                >
                  <div className="flex space-x-2 ">
                    <div className="relative flex my-auto">
                      <Image
                        src={supportedcoins["xdai"].image}
                        width={30}
                        height={30}
                        alt=""
                        className="rounded-full "
                      />
                      <Image
                        src={supportedcoins["gnosis"].image}
                        width={15}
                        height={15}
                        alt=""
                        className="rounded-full absolute -bottom-1 -left-1 border border-card"
                      />
                    </div>
                    <div className="flex flex-col">
                      <p className="text-md font-semibold leading-none">
                        {supportedcoins["xdai"].symbol}
                      </p>
                      <p className="text-[11px]">on Gnosis Chain</p>
                    </div>
                  </div>
                </MenubarItem>
                <MenubarItem
                  disabled={fromToken == "gnosis" && fromChain == "gnosis"}
                  onClick={() => {
                    setToToken("gnosis");
                    setChevron(true);
                    setToChain("gnosis");
                  }}
                >
                  <div className="flex space-x-2 ">
                    <div className="relative flex my-auto">
                      <Image
                        src={supportedcoins["gnosis"].image}
                        width={30}
                        height={30}
                        alt=""
                        className="rounded-full "
                      />
                      <Image
                        src={supportedcoins["gnosis"].image}
                        width={15}
                        height={15}
                        alt=""
                        className="rounded-full absolute -bottom-1 -left-1 border border-card"
                      />
                    </div>
                    <div className="flex flex-col">
                      <p className="text-md font-semibold leading-none">
                        {supportedcoins["gnosis"].symbol}
                      </p>
                      <p className="text-[11px]">on Gnosis Chain</p>
                    </div>
                  </div>
                </MenubarItem>
                {Object.entries(supportedcoins)
                  .slice(4, 8)
                  .map(([coinId, coin]) => (
                    <MenubarItem
                      disabled={coinId == fromToken && fromChain == "gnosis"}
                      onClick={() => {
                        setToToken(coinId);
                        setToChain("gnosis");
                        setChevron(true);
                      }}
                    >
                      <div className="flex space-x-2 ">
                        <div className="relative flex my-auto">
                          <Image
                            src={coin.image}
                            width={30}
                            height={30}
                            alt=""
                            className="rounded-full "
                          />
                          <Image
                            src={supportedcoins["gnosis"].image}
                            width={15}
                            height={15}
                            alt=""
                            className="rounded-full absolute -bottom-1 -left-1 border border-card"
                          />
                        </div>
                        <div className="flex flex-col">
                          <p className="text-md font-semibold leading-none">
                            {coin.symbol}
                          </p>
                          <p className="text-[11px]">on Gnosis Chain</p>
                        </div>
                      </div>
                    </MenubarItem>
                  ))}
              </ScrollArea>
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
          ~$
          {convertToUsd(
            prices,
            toChain == "gnosis" ? gnosis.id : mainnet.id,
            toToken,
            toBalance
          )}
        </p>
      </CardFooter>
    </Card>
  );
}
