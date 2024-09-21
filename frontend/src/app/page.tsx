"use client";

import { useAccount, useSwitchChain } from "wagmi";
import { useEffect, useState } from "react";
import "@/styles/spinner.css";
import Modals from "@/components/modals";
import { Button } from "@/components/ui/button";
import ConnectButton from "@/components/ui/connect-button";
import { useEnvironmentContext } from "@/components/context";
import { fetchBalanceAndPrice } from "@/lib/one-inch/fetch-balance-and-price";
import { gnosis } from "viem/chains";
import Spinner from "@/components/ui/loading";

export default function Page() {
  const { address, status } = useAccount();
  const { switchChainAsync } = useSwitchChain();
  const [option, setOption] = useState<number>(0);
  const { setBalances, setPrices } = useEnvironmentContext();
  const [loading, setLoading] = useState<boolean>(false);
  useEffect(() => {
    if (status === "connected" && address != undefined) {
      setLoading(true);
      fetchBalanceAndPrice(address, setBalances, setPrices).then(() => {
        setLoading(false);
      });
    }
  }, [status, address]);
  return status != "connected" || address == undefined || loading ? (
    <div className="flex justify-center space-x-4">
      {loading ? <Spinner /> : <ConnectButton />}
    </div>
  ) : (
    <>
      <Modals option={option} setOption={setOption} />

      <div className="flex justify-center space-x-4">
        <Button
          variant="secondary"
          onClick={async () => {
            try {
              await switchChainAsync({
                chainId: gnosis.id,
              });
              setOption(1);
            } catch (e) {
              console.log(e);
            }
          }}
        >
          Mission One
        </Button>
        <Button
          variant="secondary"
          onClick={async () => {
            try {
              await switchChainAsync({
                chainId: gnosis.id,
              });
              setOption(2);
            } catch (e) {
              console.log(e);
            }
          }}
        >
          Mission Two
        </Button>
        <Button
          variant="secondary"
          onClick={async () => {
            try {
              await switchChainAsync({
                chainId: gnosis.id,
              });
              setOption(3);
            } catch (e) {
              console.log(e);
            }
          }}
        >
          Mission Three
        </Button>
        <Button
          variant="secondary"
          onClick={async () => {
            try {
              await switchChainAsync({
                chainId: gnosis.id,
              });
              setOption(4);
            } catch (e) {
              console.log(e);
            }
          }}
        >
          Mission Four
        </Button>
      </div>
    </>
  );
}
