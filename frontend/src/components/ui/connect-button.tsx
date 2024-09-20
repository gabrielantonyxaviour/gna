import { useAccount, useConnect, useDisconnect, useSwitchChain } from "wagmi";
import { injected } from "wagmi/connectors";
import { arbitrumSepolia } from "viem/chains";
import { Button } from "./button";
import { Icons } from "./icons";
import {
  Menubar,
  MenubarTrigger,
  MenubarContent,
  MenubarItem,
  MenubarMenu,
} from "@/components/ui/menubar";
import Image from "next/image";
import { supportedchains } from "@/lib/constants";
import { ChevronDown, ChevronUp } from "lucide-react";
import { useState } from "react";
import { usePathname } from "next/navigation";

export default function ConnectButton() {
  const { address, status, chainId } = useAccount();
  const { connect } = useConnect();
  const { disconnectAsync } = useDisconnect();
  const { switchChainAsync } = useSwitchChain();
  const [chainChevron, setChainChevron] = useState(false);
  const pathname = usePathname();

  return status == "connected" &&
    address != undefined &&
    chainId != undefined ? (
    <>
      <Menubar
        onClick={() => {
          setChainChevron(!chainChevron);
        }}
        className="border-none text-sm py-auto bg-secondary mx-2"
      >
        <MenubarMenu>
          <MenubarTrigger
            className="w-full"
            onClick={() => {
              setChainChevron(!chainChevron);
            }}
          >
            <div className="flex space-x-2 items-center w-full justify-between">
              {!Object.keys(supportedchains).includes(chainId.toString()) ? (
                <div className="flex space-x-2">
                  <p>❌</p>
                  <p>Wrong Network</p>
                </div>
              ) : (
                <div className="flex space-x-2">
                  <Image
                    src={supportedchains[chainId.toString()].image}
                    width={20}
                    height={20}
                    alt=""
                    className="rounded-full"
                  />
                  <p>{supportedchains[chainId.toString()].name}</p>
                </div>
              )}

              {!chainChevron ? (
                <ChevronUp size={20} />
              ) : (
                <ChevronDown size={20} />
              )}
            </div>
          </MenubarTrigger>
          <MenubarContent className="w-full">
            {Object.values(supportedchains).map((chain) => (
              <MenubarItem
                key={chain.id}
                className=" cursor-pointer w-full"
                onClick={async () => {
                  try {
                    await switchChainAsync({
                      chainId: chain.chainId,
                    });
                    setChainChevron(true);
                  } catch (e) {
                    console.log(e);
                  }
                }}
              >
                <div className="flex space-x-2 items-center w-full justify-between">
                  <div className="flex space-x-2">
                    <Image
                      src={chain.image}
                      width={20}
                      height={20}
                      alt=""
                      className="rounded-full"
                    />
                    <p>{chain.name}</p>
                  </div>
                </div>
              </MenubarItem>
            ))}
          </MenubarContent>
        </MenubarMenu>
      </Menubar>

      <Button
        className="my-auto flex space-x-2"
        onClick={async () => {
          await disconnectAsync();
        }}
      >
        <Image
          src={`/avatar.jpeg`}
          width={25}
          height={25}
          alt="Avatar"
          className="rounded-full "
        />
        <p>{address?.slice(0, 6) + "..." + address?.slice(-6)}</p>
      </Button>
    </>
  ) : (
    <Button
      className="my-auto"
      onClick={() => {
        console.log("connect");
        connect({
          chainId: Number(Object.keys(supportedchains)[1]),
          connector: injected(),
        });
      }}
    >
      Connect Wallet
    </Button>
  );
}
