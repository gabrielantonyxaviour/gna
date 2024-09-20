import { BalanceResponse, GasData, PriceResponse } from "@/lib/type";
import React, {
  createContext,
  useContext,
  useState,
  ReactNode,
  useMemo,
} from "react";
import { FusionSDK, NetworkEnum } from "@1inch/fusion-sdk";
interface GrandNounsAutoContextType {
  balances: BalanceResponse[];
  setBalances: React.Dispatch<React.SetStateAction<BalanceResponse[]>>;
  prices: PriceResponse[];
  setPrices: React.Dispatch<React.SetStateAction<PriceResponse[]>>;
  gasData: GasData;
  setGasData: React.Dispatch<React.SetStateAction<GasData>>;
  ethereumSdk: FusionSDK;
  gnosisSdk: FusionSDK;
}

const GrandNounsAutoContext = createContext<
  GrandNounsAutoContextType | undefined
>(undefined);

export const useEnvironmentContext = () => {
  const context = useContext(GrandNounsAutoContext);
  if (!context) {
    throw new Error(
      "useEnvironmentContext must be used within a GrandNounsAutoProvider"
    );
  }
  return context;
};

export const GrandNounsAutoProvider = ({
  children,
}: {
  children: ReactNode;
}) => {
  const [balances, setBalances] = useState<BalanceResponse[]>([]);
  const [prices, setPrices] = useState<PriceResponse[]>([]);
  const [gasData, setGasData] = useState<GasData>({
    baseFee: "0",
    low: {
      maxPriorityFeePerGas: "0",
      maxFeePerGas: "0",
    },
    medium: {
      maxPriorityFeePerGas: "0",
      maxFeePerGas: "0",
    },
    high: {
      maxPriorityFeePerGas: "0",
      maxFeePerGas: "0",
    },
    instant: {
      maxPriorityFeePerGas: "0",
      maxFeePerGas: "0",
    },
  });
  const ethereumSdk = useMemo(() => {
    return new FusionSDK({
      url: "https://api.1inch.dev/fusion",
      network: NetworkEnum.ETHEREUM,
      authKey: process.env.NEXT_PUBLIC_ONE_INCH_API_KEY || "",
    });
  }, []);
  const gnosisSdk = useMemo(() => {
    return new FusionSDK({
      url: "https://api.1inch.dev/fusion",
      network: NetworkEnum.GNOSIS,
      authKey: process.env.NEXT_PUBLIC_ONE_INCH_API_KEY || "",
    });
  }, []);
  return (
    <GrandNounsAutoContext.Provider
      value={{
        balances,
        setBalances,
        prices,
        setPrices,
        gasData,
        setGasData,
        ethereumSdk,
        gnosisSdk,
      }}
    >
      {children}
    </GrandNounsAutoContext.Provider>
  );
};
