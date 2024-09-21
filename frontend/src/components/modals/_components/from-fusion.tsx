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
import convertToUsd from "@/lib/one-inch/convert-to-usd";
import { gnosis, mainnet } from "viem/chains";
import { useEnvironmentContext } from "@/components/context";
import { ScrollArea } from "@/components/ui/scroll-area";
export default function FromFusion({
  fromAmount,
  setFromAmount,
  fromToken,
  setFromToken,
  fromChain,
  setFromChain,
  toChain,
  fromBalance,
  toToken,
}: {
  toToken: string;
  fromAmount: string;
  fromBalance: string;
  setFromAmount: (fromAmount: string) => void;
  fromChain: string;
  setFromChain: (fromChain: string) => void;
  toChain: string;
  fromToken: string;
  setFromToken: (fromToken: string) => void;
}) {
  const { chainId } = useAccount();
  const [chevron, setChevron] = useState(true);
  const { prices } = useEnvironmentContext();

  useEffect(() => {
    console.log("FROM FUSION");
    console.log({
      fromAmount,
      setFromAmount,
      fromToken,
      setFromToken,
      fromChain,
      setFromChain,
      toChain,
      fromBalance,
      toToken,
    });
  }, []);
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
                <div className="relative flex my-auto">
                  <Image
                    src={supportedcoins[fromToken].image}
                    width={30}
                    height={30}
                    alt=""
                    className="rounded-full "
                  />
                  <Image
                    src={supportedcoins[fromChain].image}
                    width={15}
                    height={15}
                    alt=""
                    className="rounded-full absolute -bottom-1 -left-1 border border-card"
                  />
                </div>
                <div className="flex flex-col">
                  <p className="text-sm font-semibold leading-none text-left">
                    {supportedcoins[fromToken].symbol}
                  </p>
                  <p className="text-[11px] font-medium leading-none">
                    on {supportedcoins[fromChain].name}
                  </p>
                </div>
                {!chevron ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
              </div>
            </MenubarTrigger>
            <MenubarContent>
              <ScrollArea className="h-[250px]">
                <MenubarItem
                  disabled={toToken == "eth" && toChain == "eth"}
                  onClick={() => {
                    setFromToken("eth");
                    setChevron(true);
                    setFromChain("eth");
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
                      disabled={coinId == toToken && toChain == "eth"}
                      onClick={() => {
                        setFromToken(coinId);
                        setFromChain("eth");
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
                  disabled={toToken == "xdai" && toChain == "gnosis"}
                  onClick={() => {
                    setFromToken("xdai");
                    setChevron(true);
                    setFromChain("gnosis");
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
                {chainId == gnosis.id && (
                  <>
                    <MenubarItem
                      disabled={toToken == "wxdai" && toChain == "gnosis"}
                      onClick={() => {
                        setFromToken("wxdai");
                        setChevron(true);
                        setFromChain("gnosis");
                      }}
                    >
                      <div className="flex space-x-2 ">
                        <div className="relative flex my-auto">
                          <Image
                            src={supportedcoins["wxdai"].image}
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
                            {supportedcoins["wxdai"].symbol}
                          </p>
                          <p className="text-[11px]">on Gnosis Chain</p>
                        </div>
                      </div>
                    </MenubarItem>
                    <MenubarItem
                      disabled={toToken == "gnosis" && toChain == "gnosis"}
                      onClick={() => {
                        setFromToken("gnosis");
                        setChevron(true);
                        setFromChain("gnosis");
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
                  </>
                )}

                {Object.entries(supportedcoins)
                  .slice(4, 7)
                  .map(([coinId, coin]) => (
                    <MenubarItem
                      disabled={coinId == toToken && toChain == "gnosis"}
                      onClick={() => {
                        setFromToken(coinId);
                        setFromChain("gnosis");
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
          {" "}
          ~$
          {convertToUsd(
            prices,
            fromChain == "gnosis" ? gnosis.id : mainnet.id,
            fromToken,
            fromBalance
          )}
        </p>
      </CardFooter>
    </Card>
  );
}
