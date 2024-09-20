import Order from "@/components/modals/_components/order";
import Slippage from "@/components/modals/_components/slippage";
import Swap from "@/components/modals/_components/swap";
import { Button } from "@/components/ui/button";
import { Card, CardTitle } from "@/components/ui/card";
import {
  Menubar,
  MenubarTrigger,
  MenubarContent,
  MenubarItem,
  MenubarMenu,
} from "@/components/ui/menubar";
import { supportedchains, supportedcoins } from "@/lib/constants";
import {
  ChevronDown,
  ChevronLeft,
  ChevronUp,
  RefreshCcw,
  Settings,
} from "lucide-react";
import Image from "next/image";
import { useEffect, useState } from "react";
import { useAccount } from "wagmi";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Aurora } from "./aurora";
import NotUnlocked from "./not-unlocked";
import priceIn from "@/lib/one-inch/price-in";
import { useEnvironmentContext } from "@/components/context";
import { gnosis } from "viem/chains";
interface ActionProps {
  mission: number;
  setMission: (mission: number) => void;
}
export default function Action({ mission, setMission }: ActionProps) {
  const [selectedAction, setSelectedAction] = useState(
    mission == 1 || mission == 2 ? 0 : mission == 3 ? 1 : 2
  );
  const [chainChevron, setChainChevron] = useState(true);
  const [fromAmount, setFromAmount] = useState("0");
  const [toAmount, setToAmount] = useState("0");
  const [fromToken, setFromToken] = useState("usdc");
  const [toToken, setToToken] = useState("weth");
  const { chainId } = useAccount();
  const [showSettings, setShowSettings] = useState(false);
  const [slippage, setSlippage] = useState("0.5");
  const [txStatus, setTxStatus] = useState(0);
  useEffect(() => {
    if (mission == 1 || mission == 2) setSelectedAction(0);
    else if (mission == 3) setSelectedAction(1);
    else setSelectedAction(2);
  }, [mission]);

  return (
    <Dialog
      open={mission != 0}
      onOpenChange={(op) => {
        if (op == false) setMission(0);
      }}
    >
      <DialogContent
        className={`left-[60%] translate-x-0 bg-secondary  ${
          selectedAction == 2 ? "p-0" : "p-3"
        }`}
        disableOverlay
      >
        <Aurora enabled={selectedAction == 2}>
          {txStatus == 0 && (
            <div className={`flex justify-between items-center px-1 px-2 `}>
              {showSettings ? (
                <>
                  <ChevronLeft
                    className="cursor-pointer h-5 w-5"
                    onClick={() => setShowSettings(false)}
                  />
                  <p className="font-semibold">Swap Settings</p> <div></div>
                </>
              ) : (
                <>
                  {" "}
                  <div className="flex space-x-4">
                    <p
                      className={`hover:bg-transparent cursor-pointer font-semibold ${
                        selectedAction == 0
                          ? "text-white"
                          : "text-muted-foreground  hover:text-primary"
                      }`}
                      onClick={async () => {
                        setSelectedAction(0);
                      }}
                    >
                      Swap
                    </p>
                    <p
                      className={`hover:bg-transparent cursor-pointer font-semibold  ${
                        selectedAction == 1
                          ? "text-white"
                          : "text-muted-foreground hover:text-primary"
                      }`}
                      onClick={() => setSelectedAction(1)}
                    >
                      Limit
                    </p>
                    <p
                      className={`hover:bg-transparent cursor-pointer font-semibold  ${
                        selectedAction == 2
                          ? "text-white"
                          : "text-muted-foreground hover:text-primary"
                      }`}
                      onClick={() => setSelectedAction(2)}
                    >
                      Fusion+
                    </p>
                  </div>
                  <div className="flex space-x-2 items-center select-none">
                    {selectedAction != 2 && (
                      <>
                        <Image
                          src={supportedcoins["gnosis"].image}
                          width={20}
                          height={15}
                          alt="gnosis"
                          className="rounded-full my-auto"
                        />
                        <p className="text-xs font-semibold pr-5">
                          Gnosis Chain
                        </p>
                      </>
                    )}
                    <RefreshCcw className="cursor-pointer h-6 w-6 pr-2" />
                    {selectedAction == 0 && (
                      <Settings
                        className="cursor-pointer h-5 w-5"
                        onClick={() => setShowSettings(true)}
                      />
                    )}
                  </div>
                </>
              )}
            </div>
          )}
          {showSettings ? (
            <Slippage slippage={slippage} setSlippage={setSlippage} />
          ) : selectedAction == 1 ? (
            mission == 1 ? (
              <NotUnlocked mission={"one"} />
            ) : (
              <Order
                {...{
                  fromAmount,
                  setFromAmount,
                  fromToken,
                  setFromToken,
                  toToken,
                  setToToken,
                  toAmount,
                  setToAmount,
                  isTestnet: false,
                }}
              />
            )
          ) : selectedAction == 0 ? (
            <Swap
              {...{
                fromAmount,
                setFromAmount,
                fromToken,
                setFromToken,
                toToken,
                setToToken,
                toAmount,
                setToAmount,
                slippage,
                setShowSettings,
                txStatus,
                setTxStatus,
              }}
            />
          ) : (
            mission != 4 && <NotUnlocked mission={"three"} />
          )}
        </Aurora>
      </DialogContent>
    </Dialog>
  );
}
