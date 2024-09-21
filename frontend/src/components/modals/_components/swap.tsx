import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import From from "./from";
import To from "./to";
import { useAccount } from "wagmi";
import Image from "next/image";
import { useEffect, useState } from "react";
import { ArrowDown, Cross, LogOut, X } from "lucide-react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { useEnvironmentContext } from "@/components/context";
import { supportedchains, WRAPPED_ABI } from "@/lib/constants";
import priceIn from "@/lib/one-inch/price-in";
import {
  createPublicClient,
  createWalletClient,
  custom,
  erc20Abi,
  formatEther,
  http,
  parseEther,
  zeroAddress,
} from "viem";
import { roundUpToFiveDecimals } from "@/lib/utils";
import formattedBalance from "@/lib/one-inch/formatted-balance";
import { gnosis } from "viem/chains";
import convertToUsd from "@/lib/one-inch/convert-to-usd";
import OneInchSpinner from "@/components/ui/oneinch-spinner";
import signPermit from "@/lib/one-inch/sign-permit";
import TxSubmitted from "@/components/ui/tx-submitted";
import { NetworkEnum } from "@1inch/fusion-sdk";
import { watchAsset } from "viem/actions";
import Spinner from "@/components/ui/loading";
import LoadingDots from "@/components/ui/loading-dots";
import { init } from "next/dist/compiled/webpack/webpack";

interface SwapProps {
  fromAmount: string;
  setFromAmount: (fromAmount: string) => void;
  fromToken: string;
  setFromToken: (fromToken: string) => void;
  toToken: string;
  setToToken: (toToken: string) => void;
  toAmount: string;
  setToAmount: (toAmount: string) => void;
  slippage: string;
  setShowSettings: (openSettings: boolean) => void;
  txStatus: number;
  setTxStatus: (txStatus: number) => void;
}

export default function Swap({
  fromAmount,
  setFromAmount,
  fromToken,
  setFromToken,
  toToken,
  setToToken,
  toAmount,
  setToAmount,
  txStatus,
  setTxStatus,
  slippage,
  setShowSettings,
}: SwapProps) {
  const { chainId, address } = useAccount();
  const {
    balances,
    prices,
    gnosisSdk,
    setLatestFusionOrder,
    latestFusionOrder,
  } = useEnvironmentContext();
  const [accordionOpen, setAccordionOpen] = useState<boolean>(false);
  const [permitSignature, setPermitSignature] = useState<string>("");
  const [wrapTxHash, setWrapTxHash] = useState<string>("");
  const [approveTxHash, setApproveTxHash] = useState<string>("");
  const [pending, setPending] = useState<boolean>(false);
  const [initialFromToken, setInitialFromToken] = useState<string>("");
  useEffect(() => {
    if (prices.length == 2)
      setToAmount(
        priceIn({
          prices: prices,
          fromToken: fromToken,
          toToken: toToken,
          amount: fromAmount == "" ? "0" : fromAmount,
          fromChainId: gnosis.id,
          toChainId: gnosis.id,
        })
      );
    if (txStatus == 0) setInitialFromToken(fromToken);
  }, [prices, fromAmount, fromToken, toToken]);
  return chainId == undefined ? (
    <div></div>
  ) : (
    <div>
      {txStatus == 0 ? (
        <>
          <From
            toToken={toToken}
            fromAmount={fromAmount}
            setFromAmount={setFromAmount}
            fromToken={fromToken}
            fromBalance={formattedBalance(balances, gnosis.id, fromToken)}
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
            toBalance={formattedBalance(balances, gnosis.id, toToken)}
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
                            fromChainId: gnosis.id,
                            toChainId: gnosis.id,
                          })
                        )}{" "}
                        {toToken.toUpperCase()}{" "}
                        <span className="text-muted-foreground">
                          (~$
                          {convertToUsd(prices, gnosis.id, fromToken, "1")})
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
                      <p
                        className="bg-secondary p-[1px] font-semibold cursor-pointer"
                        onClick={() => {
                          setShowSettings(true);
                        }}
                      >
                        {slippage}% Auto
                      </p>
                    </div>
                    <div className="flex justify-between">
                      <p className="text-muted-foreground">Minimum Tolerance</p>
                      <p>
                        {roundUpToFiveDecimals(
                          (
                            parseFloat(
                              priceIn({
                                prices: prices,
                                fromToken: fromToken,
                                toToken: toToken,
                                amount: fromAmount,
                                fromChainId: gnosis.id,
                                toChainId: gnosis.id,
                              })
                            ) *
                            ((100 - parseFloat(slippage)) / 100)
                          ).toString()
                        )}{" "}
                        {toToken.toUpperCase()}{" "}
                        <span className="text-muted-foreground">
                          (~$
                          {convertToUsd(
                            prices,
                            gnosis.id,
                            toToken,
                            (
                              parseFloat(
                                priceIn({
                                  prices: prices,
                                  fromToken: fromToken,
                                  toToken: toToken,
                                  amount: fromAmount,
                                  fromChainId: gnosis.id,
                                  toChainId: gnosis.id,
                                })
                              ) *
                              ((100 - parseFloat(slippage)) / 100)
                            ).toString()
                          )}
                          )
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
      ) : (txStatus == 3 && initialFromToken != "xdai") || txStatus == 5 ? (
        <div className="flex flex-col h-[250px]">
          <div className="flex justify-between space-x-4 pb-12">
            <div></div>
            <p className="font-semibold">Swap Tokens</p>
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
      ) : (txStatus == 3 && initialFromToken == "xdai") ||
        (txStatus == 1 && initialFromToken != "xdai") ? (
        <div className="flex flex-col h-[250px]">
          <div className="flex justify-between space-x-4 pb-12">
            <div></div>
            <p className="font-semibold">Approve Tokens</p>
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
      ) : (txStatus == 2 && initialFromToken != "xdai") ||
        (txStatus == 4 && initialFromToken == "xdai") ? (
        <div className="flex flex-col h-[250px]">
          <div className="flex justify-between space-x-4 pb-8">
            <div></div>
            <p className="font-semibold">
              {pending ? "Approving Tokens" : "Tokens Approved"}
            </p>
            <X
              className="cursor-pointer h-6 w-6"
              onClick={() => setTxStatus(0)}
            />
          </div>
          <TxSubmitted />
          {pending ? (
            <div className="pb-6 flex justify-center items-end space-x-4">
              <p className="font-medium text-sm text-muted-foreground text-center mb-1">
                Waiting for confirmation
              </p>
              <LoadingDots />
            </div>
          ) : (
            <p className="font-medium text-sm text-muted-foreground text-center pb-6">
              Token Approved Successfully.{" "}
              <span
                className="underline cursor-pointer"
                onClick={() => {
                  window.open(
                    `https://gnosisscan.io/tx/${approveTxHash}`,
                    "_blank"
                  );
                }}
              >
                View Tx
              </span>
            </p>
          )}
        </div>
      ) : (txStatus == 4 && initialFromToken == "xdai") ||
        (txStatus == 6 && initialFromToken != "xdai") ? (
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
        </div>
      ) : txStatus == 1 && initialFromToken == "xdai" ? (
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
        txStatus == 2 &&
        initialFromToken == "xdai" && (
          <div className="flex flex-col h-[250px]">
            <div className="flex justify-between space-x-4 pb-8">
              <div></div>
              <p className="font-semibold">
                {pending ? "Wrapping xDAI" : "xDAI Wrapped"}
              </p>
              <X
                className="cursor-pointer h-6 w-6"
                onClick={() => setTxStatus(0)}
              />
            </div>
            <TxSubmitted />
            {pending ? (
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
          const walletClient = createWalletClient({
            chain: gnosis,
            transport: custom(window.ethereum),
          });
          const publicClient = createPublicClient({
            chain: gnosis,
            transport: http(),
          });

          if (txStatus % 2 == 1 || txStatus == 6) setTxStatus(0);
          else if (txStatus == 0 && fromToken == "xdai") {
            setTxStatus(1);
            const { request } = await publicClient.simulateContract({
              address: supportedchains[gnosis.id].tokens["wxdai"],
              abi: WRAPPED_ABI,
              functionName: "deposit",
              account: address,
              args: [],
              value: parseEther(fromAmount),
            });
            const hash = await walletClient.writeContract(request);

            setWrapTxHash(hash);
            setPending(true);
            setTxStatus(2);
            await publicClient.waitForTransactionReceipt({
              hash,
            });
            setPending(false);
            setFromToken("wxdai");
          } else if (
            (txStatus == 2 && initialFromToken == "xdai") ||
            (txStatus == 0 && fromToken != "xdai")
          ) {
            setTxStatus(txStatus + 1);
            const { request } = await publicClient.simulateContract({
              address: supportedchains[gnosis.id].tokens[fromToken],
              abi: erc20Abi,
              functionName: "approve",
              args: [
                supportedchains[gnosis.id].oneInch as `0x${string}`,
                parseEther(fromAmount),
              ],
              account: address,
            });
            const hash = await walletClient.writeContract(request);

            setApproveTxHash(hash);
            setPending(true);
            setTxStatus(txStatus + 2);
            await publicClient.waitForTransactionReceipt({
              hash,
            });
            setPending(false);
          } else {
            setPending(true);
            setTxStatus(txStatus + 1);
            const latest = await gnosisSdk.placeOrder({
              fromTokenAddress: supportedchains[gnosis.id].tokens[fromToken],
              toTokenAddress: supportedchains[gnosis.id].tokens[toToken],
              amount: parseEther(fromAmount).toString(),
              walletAddress: address as `0x${string}`,
            });
            console.log(latest);
            setPending(false);
            setLatestFusionOrder(latest);
            setTxStatus(txStatus + 2);
          }
        }}
        disabled={
          pending ||
          parseFloat(fromAmount) == 0 ||
          fromAmount == "" ||
          parseFloat(fromAmount) >
            parseFloat(
              balances[1].data[supportedchains[gnosis.id].tokens[fromToken]]
            )
        }
      >
        {txStatus % 2 == 1 || pending
          ? "Cancel"
          : (txStatus == 4 && initialFromToken == "xdai") ||
            (txStatus == 2 && initialFromToken != "xdai")
          ? "Swap"
          : (txStatus == 6 && initialFromToken == "xdai") ||
            (txStatus == 4 && initialFromToken != "xdai")
          ? "Done"
          : parseFloat(fromAmount) == 0 || fromAmount == ""
          ? "Enter Amount"
          : parseFloat(fromAmount) >
            parseFloat(formattedBalance(balances, gnosis.id, fromToken))
          ? "Insufficient Funds"
          : fromToken == "xdai"
          ? "Wrap xDAI"
          : "Approve Tokens"}
      </Button>
    </div>
  );
}
