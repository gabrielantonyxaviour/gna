import {
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Accordion } from "@radix-ui/react-accordion";
import { ArrowDown, CornerDownLeft, X } from "lucide-react";
import Image from "next/image";
import { useEffect, useState } from "react";
import FromFusion from "./from-fusion";
import ToFusion from "./to-fusion";
import { useEnvironmentContext } from "@/components/context";
import priceIn from "@/lib/one-inch/price-in";
import { gnosis, mainnet } from "viem/chains";
import formattedBalance from "@/lib/one-inch/formatted-balance";
import convertToUsd from "@/lib/one-inch/convert-to-usd";
import { roundUpToFiveDecimals } from "@/lib/utils";
import {
  createPublicClient,
  createWalletClient,
  custom,
  formatEther,
  http,
  parseEther,
  zeroAddress,
} from "viem";
import { supportedchains, WRAPPED_ABI } from "@/lib/constants";
import { useAccount, useSwitchChain } from "wagmi";
import signPermit from "@/lib/one-inch/sign-permit";
import TxSubmitted from "@/components/ui/tx-submitted";
import LoadingDots from "@/components/ui/loading-dots";
import OneInchSpinner from "@/components/ui/oneinch-spinner";

interface FusionProps {
  fromAmount: string;
  setFromAmount: (fromAmount: string) => void;
  fromToken: string;
  setFromToken: (fromToken: string) => void;
  toToken: string;
  setToToken: (toToken: string) => void;
  toAmount: string;
  setToAmount: (toAmount: string) => void;
  slippage: string;
  txStatus: number;
  setTxStatus: (txStatus: number) => void;
}

export default function Fusion({
  fromAmount,
  setFromAmount,
  fromToken,
  setFromToken,
  toToken,
  setToToken,
  toAmount,
  setToAmount,
  slippage,
  txStatus,
  setTxStatus,
}: FusionProps) {
  const [accordionOpen, setAccordionOpen] = useState<boolean>(false);
  const [fromChain, setFromChain] = useState("gnosis");
  const [toChain, setToChain] = useState("eth");
  const {
    prices,
    balances,
    gnosisSdk,
    ethereumSdk,
    setLatestFusionOrder,
    latestFusionOrder,
  } = useEnvironmentContext();
  const { chainId, address } = useAccount();
  const { switchChainAsync } = useSwitchChain();
  const [wrapPending, setWrapPending] = useState<boolean>(true);
  const [wrapTxHash, setWrapTxHash] = useState<string>("");
  const [permitSignature, setPermitSignature] = useState<string>("");
  useEffect(() => {
    if (fromChain == "gnosis" && chainId == mainnet.id) {
      switchChainAsync({ chainId: gnosis.id });
    } else if (fromChain == "eth" && chainId == gnosis.id) {
      switchChainAsync({ chainId: mainnet.id });
    }
    if (prices.length == 2) {
      setToAmount(
        priceIn({
          prices: prices,
          fromToken: fromToken,
          toToken: toToken,
          amount: fromAmount == "" ? "0" : fromAmount,
          fromChainId: fromChain == "gnosis" ? gnosis.id : mainnet.id,
          toChainId: toChain == "gnosis" ? gnosis.id : mainnet.id,
        })
      );
    }
  }, [prices, fromAmount, fromToken, toToken, toChain, fromChain]);
  return chainId == undefined ? (
    <div></div>
  ) : (
    <div className="pt-2">
      {txStatus == 0 ? (
        <>
          <FromFusion
            toToken={toToken}
            fromAmount={fromAmount}
            fromChain={fromChain}
            toChain={toChain}
            setFromChain={setFromChain}
            setFromAmount={setFromAmount}
            fromToken={fromToken}
            fromBalance={formattedBalance(
              balances,
              fromChain == "gnosis" ? gnosis.id : mainnet.id,
              fromToken
            )}
            setFromToken={setFromToken}
          />
          <div className="relative m-0 p-1">
            <div className="absolute bg-slate-700 left-[49%] -top-[100%] rounded-full">
              <ArrowDown
                className="p-[2px] font-bold text-white h-6 w-6 cursor-pointer transition-transform duration-300 hover:rotate-180"
                onClick={() => {
                  setFromToken(toToken);
                  setToToken(fromToken);
                  setFromChain(toChain);
                  setToChain(fromChain);
                }}
              />
            </div>
          </div>
          <ToFusion
            fromToken={fromToken}
            fromChain={fromChain}
            toAmount={toAmount}
            toToken={toToken}
            setToToken={setToToken}
            toChain={toChain}
            setToChain={setToChain}
            toBalance={formattedBalance(
              balances,
              toChain == "gnosis" ? gnosis.id : mainnet.id,
              toToken
            )}
            isLimit={false}
          />
          <Card className="border-none my-2 bg-slate-900">
            <CardContent className="m-0 px-4 py-0">
              <Accordion
                type="single"
                collapsible
                className="m-0 p-0"
                onValueChange={() => {
                  setAccordionOpen(!accordionOpen);
                }}
              >
                <AccordionItem value={"string"} className="border-none m-0 p-0">
                  <AccordionTrigger className="hover:no-underline">
                    <div className="w-full flex justify-between">
                      {" "}
                      <p className="text-sm">
                        1 {fromToken.toUpperCase()} ={" "}
                        {roundUpToFiveDecimals(
                          priceIn({
                            prices: prices,
                            fromToken: fromToken,
                            toToken: toToken,
                            amount: "1",
                            fromChainId:
                              fromChain == "gnosis" ? gnosis.id : mainnet.id,
                            toChainId:
                              toChain == "gnosis" ? gnosis.id : mainnet.id,
                          })
                        )}{" "}
                        {toToken.toUpperCase()}{" "}
                        <span className="text-muted-foreground">
                          (~$
                          {convertToUsd(
                            prices,
                            fromChain == "gnosis" ? gnosis.id : mainnet.id,
                            fromToken,
                            "1"
                          )}
                          )
                        </span>{" "}
                      </p>
                      {!accordionOpen && (
                        <div className="flex text-sm pr-2 space-x-2">
                          <Image
                            src={"/fusion/glow.png"}
                            width={20}
                            height={20}
                            alt=""
                            className="rounded-full"
                          />
                          <p>Free</p>
                        </div>
                      )}
                    </div>
                  </AccordionTrigger>
                  <AccordionContent className="m-0 pb-3 flex flex-col space-y-3">
                    <div className="flex justify-between">
                      <p className="text-muted-foreground">
                        Slippage Tolerance
                      </p>
                      <p className="bg-secondary p-[1px] font-semibold">
                        Auto {slippage}%
                      </p>
                    </div>
                    <div className="flex justify-between">
                      <p className="text-muted-foreground">Minimum Tolerance</p>
                      <p>
                        0.00244056 {toToken.toUpperCase()}{" "}
                        <span className="text-muted-foreground">
                          (~$146.57)
                        </span>
                      </p>
                    </div>
                    <div className="flex justify-between">
                      <p className="text-muted-foreground">Network Fee</p>
                      <div className="flex text-sm pr-2 space-x-2">
                        <Image
                          src={"/fusion/glow.png"}
                          width={20}
                          height={20}
                          alt=""
                          className="rounded-full"
                        />
                        <p>Free</p>
                      </div>
                    </div>
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
            </CardContent>
          </Card>
        </>
      ) : txStatus == 3 ? (
        <div className="flex flex-col h-[250px]">
          <div className="flex justify-between space-x-4 pb-12">
            <div></div>
            <p className="font-semibold">Permit Swap</p>
            <X
              className="cursor-pointer h-6 w-6"
              onClick={() => setTxStatus(0)}
            />
          </div>
          <OneInchSpinner />
          <p className="font-medium text-sm text-muted-foreground text-center py-4">
            Please, sign transaction in your wallet.
          </p>
        </div>
      ) : txStatus == 4 ? (
        <div className="flex flex-col h-[250px]">
          <div className="flex justify-between space-x-4 pb-8">
            <div></div>
            <p className="font-semibold">Swap Submitted</p>
            <X
              className="cursor-pointer h-6 w-6"
              onClick={() => setTxStatus(0)}
            />
          </div>
          <TxSubmitted />
          <p className="font-medium text-sm text-muted-foreground text-center pb-6">
            Waiting for Resolvers to confirm the swap
          </p>
          <p className="text-xs">
            {JSON.stringify(latestFusionOrder, null, 2)}
          </p>
        </div>
      ) : txStatus == 1 ? (
        <div className="flex flex-col h-[250px]">
          <div className="flex justify-between space-x-4 pb-12">
            <div></div>
            <p className="font-semibold">Wrap xDAI to WxDAI</p>
            <X
              className="cursor-pointer h-6 w-6"
              onClick={() => setTxStatus(0)}
            />
          </div>
          <OneInchSpinner />
          <p className="font-medium text-sm text-muted-foreground text-center py-4">
            Please, sign transaction in your wallet.
          </p>
        </div>
      ) : (
        txStatus == 2 && (
          <div className="flex flex-col h-[250px]">
            <div className="flex justify-between space-x-4 pb-8">
              <div></div>
              <p className="font-semibold">xDAI Wrapped</p>
              <X
                className="cursor-pointer h-6 w-6"
                onClick={() => setTxStatus(0)}
              />
            </div>
            <TxSubmitted />
            {wrapPending ? (
              <div className="pb-6 flex justify-center items-end space-x-4">
                <p className="font-medium text-sm text-muted-foreground text-center mb-1">
                  Waiting for confirmation
                </p>
                <LoadingDots />
              </div>
            ) : (
              <p className="font-medium text-sm text-muted-foreground text-center pb-6">
                Token Wrapped Successfully.{" "}
                <span
                  className="underline cursor-pointer"
                  onClick={() => {
                    window.open(
                      `https://gnosisscan.io/tx/${wrapTxHash}`,
                      "_blank"
                    );
                  }}
                >
                  View Tx
                </span>
              </p>
            )}
          </div>
        )
      )}

      <Button
        variant={"default"}
        className="w-full font-bold"
        onClick={async () => {
          if (txStatus % 2 == 1 || txStatus == 4) setTxStatus(0);
          else if (fromToken == "xdai" || fromToken == "eth") {
            const walletClient = createWalletClient({
              chain: fromToken == "eth" ? mainnet : gnosis,
              transport: custom(window.ethereum),
            });
            const publicClient = createPublicClient({
              chain: fromToken == "eth" ? mainnet : gnosis,
              transport: http(),
            });

            setTxStatus(1);
            const { request } = await publicClient.simulateContract({
              address:
                supportedchains[fromToken == "eth" ? mainnet.id : gnosis.id]
                  .tokens[fromToken],
              abi: WRAPPED_ABI,
              functionName: "deposit",
              account: address,
              args: [],
              value: parseEther(fromAmount),
            });
            const hash = await walletClient.writeContract(request);
            setWrapTxHash(hash);
            setWrapPending(true);
            setTxStatus(2);
            const transaction = await publicClient.waitForTransactionReceipt({
              hash,
            });
            setWrapPending(false);
            setFromToken("w" + fromToken);
          } else {
            setTxStatus(3);
            const walletClient = createWalletClient({
              chain: fromToken == "eth" ? mainnet : gnosis,
              transport: custom(window.ethereum),
            });
            const { signature } = await signPermit({
              walletClient,
              chainId: fromToken == "eth" ? mainnet.id : gnosis.id,
              maker: address || "0x",
              makerAsset:
                supportedchains[fromToken == "eth" ? mainnet.id : gnosis.id]
                  .tokens[fromToken],
              takerAsset:
                supportedchains[fromToken == "eth" ? mainnet.id : gnosis.id]
                  .tokens[toToken],
              makingAmount: parseEther(fromAmount).toString(),
              takingAmount: parseEther(toAmount).toString(),
              receiver: zeroAddress,
            });
            setPermitSignature(signature);
            const latest = await (fromToken == "eth"
              ? ethereumSdk
              : gnosisSdk
            ).placeOrder({
              fromTokenAddress: supportedchains[gnosis.id].tokens[fromToken],
              toTokenAddress: supportedchains[gnosis.id].tokens[toToken],
              amount: parseEther(fromAmount).toString(),
              walletAddress: address as `0x${string}`,
              permit: signature,
              isPermit2: true,
              // fee: {
              //   takingFeeBps: 100,
              //   takingFeeReceiver: zeroAddress,
              // },
            });
            setLatestFusionOrder(latest);
            setTxStatus(4);
          }
        }}
        disabled={
          wrapPending ||
          parseFloat(fromAmount) == 0 ||
          fromAmount == "" ||
          parseFloat(fromAmount) >
            parseFloat(
              balances[1].data[supportedchains[gnosis.id].tokens[fromToken]]
            )
        }
      >
        {txStatus % 2 == 1
          ? "Cancel"
          : txStatus == 4
          ? "Done"
          : parseFloat(fromAmount) == 0 || fromAmount == ""
          ? "Enter Amount"
          : parseFloat(fromAmount) >
            parseFloat(
              formattedBalance(
                balances,
                fromChain == "gnosis" ? gnosis.id : mainnet.id,
                fromToken
              )
            )
          ? "Insufficient Funds"
          : fromToken == "xdai"
          ? "Wrap xDAI"
          : fromToken == "eth"
          ? "Wrap ETH"
          : "Swap"}
      </Button>
    </div>
  );
}
