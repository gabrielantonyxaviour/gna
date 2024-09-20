import Image from "next/image";

import ConnectButton from "@/components/ui/connect-button";
import { useAccount } from "wagmi";

interface LayoutComponentProps {
  children: React.ReactNode;
}

export default function LayoutComponent({ children }: LayoutComponentProps) {
  return (
    <>
      <div className="h-screen flex">
        <div className="px-8 w-full flex flex-col items-center mt-4">
          <div className="flex w-full justify-between">
            <Image src={"/logo.png"} height={50} width={50} alt="Logo" />
            <div className="flex items-center">
              <ConnectButton />
            </div>
          </div>
          <div className="h-full w-full flex flex-col justify-center items-center">
            {children}
          </div>
        </div>
      </div>
    </>
  );
}
