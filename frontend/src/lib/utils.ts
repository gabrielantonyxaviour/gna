import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import { Position } from "./type";
import { parseEther } from "viem";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
export function roundUpToFiveDecimals(floatStr: string): string {
  const num = parseFloat(floatStr);
  console.log(num);
  if (isNaN(num)) {
    return "0.00";
  }

  const roundedNum = Math.ceil(num * 100000) / 100000;

  let result = roundedNum.toFixed(5);
  if (result.endsWith("00000")) {
    result = parseFloat(result).toFixed(1);
  } else if (result.endsWith("000")) {
    result = parseFloat(result).toFixed(2);
  } else if (result.endsWith("00")) {
    result = parseFloat(result).toFixed(3);
  } else if (result.endsWith("0")) {
    result = parseFloat(result).toFixed(4);
  } else {
    result = parseFloat(result).toFixed(5);
  }

  return result;
}
export function timeAgo(timestamp: string | number | Date): string {
  const now = new Date();
  const timeDiff =
    now.getTime() - new Date(parseInt(timestamp + "000")).getTime();
  const seconds = Math.floor(timeDiff / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);
  const months = Math.floor(days / 30);

  if (months > 0) return `${months} month${months > 1 ? "s" : ""} ago`;
  if (days > 0) return `${days} day${days > 1 ? "s" : ""} ago`;
  if (hours > 0) return `${hours} hour${hours > 1 ? "s" : ""} ago`;
  if (minutes > 0) return `${minutes} minute${minutes > 1 ? "s" : ""} ago`;
  return `${seconds} second${seconds > 1 ? "s" : ""} ago`;
}

export async function getTotalDeposited(position: {
  token0: string;
  token1: string;
  depositedToken0: string;
  depositedToken1: string;
}): Promise<string> {
  const res = await fetch(
    `/api/coinmarketcap/convert?from=${position.token0.toLowerCase()}&to=${position.token1.toLowerCase()}`
  );
  const data = await res.json();
  const total =
    parseFloat(position.depositedToken0) * data.amount.from +
    parseFloat(position.depositedToken1) * data.amount.to;
  return roundUpToFiveDecimals(total.toString());
}

export async function getTotalClaimed(position: {
  token0: string;
  token1: string;
  claimedToken0: string;
  claimedToken1: string;
}): Promise<string> {
  const res = await fetch(
    `/api/coinmarketcap/convert?from=${position.token0.toLowerCase()}&to=${position.token1.toLowerCase()}`
  );
  const data = await res.json();
  const total =
    parseFloat(position.claimedToken0) * data.amount.from +
    parseFloat(position.claimedToken1) * data.amount.to;
  return roundUpToFiveDecimals(total.toString());
}
