import React from "react";
import { supportedchains } from "../constants";
import { BalanceResponse, PriceResponse } from "../type";
import { gnosis, mainnet } from "viem/chains";
import { createPublicClient, http, parseEther, zeroAddress } from "viem";
export const fetchBalanceAndPrice = async (
  walletAddress: string,
  setBalances: React.Dispatch<React.SetStateAction<BalanceResponse[]>>,
  setPrices: React.Dispatch<React.SetStateAction<PriceResponse[]>>
) => {
  const prices: PriceResponse[] = [];
  const balances: BalanceResponse[] = [];
  try {
    const balanceGnosisResponse = await fetch(
      `/api/one-inch/balance?address=${walletAddress}&chain=100`
    );
    const balanceGnosisData = await balanceGnosisResponse.json();
    const gnosisPublicClient = createPublicClient({
      chain: gnosis,
      transport: http(),
    });
    balanceGnosisData.data[zeroAddress] = (
      await gnosisPublicClient.getBalance({
        address: walletAddress as `0x${string}`,
      })
    ).toString();
    balances.push({ chain: 100, data: balanceGnosisData.data });
    await new Promise((resolve) => setTimeout(resolve, 1000)); // 1-second delay
    const priceGnosisResponse = await fetch(
      `/api/one-inch/usd-value?chain=100`
    );
    const priceGnosisData = await priceGnosisResponse.json();
    prices.push({ chain: 100, data: priceGnosisData.data });

    await new Promise((resolve) => setTimeout(resolve, 1000)); // 1-second delay

    const balanceMainnetResponse = await fetch(
      `/api/one-inch/balance?address=${walletAddress}&chain=1`
    );
    const balanceMainnetData = await balanceMainnetResponse.json();
    const mainnetPublicClient = createPublicClient({
      chain: mainnet,
      transport: http(),
    });

    balanceMainnetData.data[zeroAddress] = (
      await mainnetPublicClient.getBalance({
        address: walletAddress as `0x${string}`,
      })
    ).toString();
    balances.push({ chain: 1, data: balanceMainnetData.data });

    await new Promise((resolve) => setTimeout(resolve, 1000)); // 1-second delay

    const priceMainnetResponse = await fetch(`/api/one-inch/usd-value?chain=1`);
    const priceMainnetData = await priceMainnetResponse.json();

    const ethPrice =
      parseFloat(Object.values(priceGnosisData.data)[2] as string) / 1e18;
    prices.push({
      chain: 1,
      data: Object.entries(priceMainnetData.data).reduce(
        (
          acc: Record<string, string>,
          [tokenAddress, balanceInWei]: [string, unknown]
        ) => {
          const balanceInEth = parseFloat(balanceInWei as string) / 1e18;
          const usdValue = balanceInEth * ethPrice;
          acc[tokenAddress] = parseEther(usdValue.toString()).toString();
          return acc;
        },
        {}
      ),
    });

    setPrices(prices.reverse());
    setBalances(balances.reverse());
  } catch (error) {
    console.error(`Error fetching data`, error);
  }
};
