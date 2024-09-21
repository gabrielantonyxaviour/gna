import Image from "next/image";

import ConnectButton from "@/components/ui/connect-button";
import { useAccount } from "wagmi";
import { DynamicWidget } from "@dynamic-labs/sdk-react-core";
import { useEnvironmentContext } from "./context";
import WorldcoinComponent from "./WorldcoinComponent";

interface LayoutComponentProps {
  children: React.ReactNode;
}

export default function LayoutComponent({ children }: LayoutComponentProps) {
  const { worldcoinData } = useEnvironmentContext();
  const { address, status } = useAccount();
  return (
    <>
      <div className="h-screen flex">
        <div className="px-8 w-full flex flex-col items-center mt-2">
          <div className="flex w-full justify-between">
            <Image src={"/logo.png"} height={200} width={200} alt="Logo" />
            <div className="flex items-center">
              <DynamicWidget />
            </div>
          </div>
          <div className="h-full w-full flex flex-col justify-center items-center">
            {worldcoinData == null && false ? (
              <WorldcoinComponent />
            ) : (address == undefined || status != "connected") && false ? (
              <DynamicWidget />
            ) : (
              children
            )}
          </div>
        </div>
      </div>
    </>
  );
}
