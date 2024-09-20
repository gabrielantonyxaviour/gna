"use client";

import * as React from "react";
import { TrendingUp } from "lucide-react";
import { Label, Pie, PieChart } from "recharts";

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";

export function PieChartComponent({
  usdBalances,
  hideTestnet,
}: {
  usdBalances: Record<string, string>;
  hideTestnet: boolean;
}) {
  const chartData = [
    {
      token: "bnb",
      balance: parseFloat(usdBalances.bnb),
      fill: "var(--color-bnb)",
    },
    {
      token: "eth",
      balance: parseFloat(usdBalances.eth),
      fill: "var(--color-eth)",
    },
    {
      token: "usdc",
      balance: parseFloat(usdBalances.usdc),
      fill: "var(--color-usdc)",
    },
    {
      token: "usdt",
      balance: parseFloat(usdBalances.usdt),
      fill: "var(--color-usdt)",
    },
    {
      token: "link",
      balance: parseFloat(usdBalances.link),
      fill: "var(--color-link)",
    },
    {
      token: "tbnb",
      balance: parseFloat(usdBalances.tbnb),
      fill: "var(--color-tbnb)",
    },
    {
      token: "teth",
      balance: parseFloat(usdBalances.teth),
      fill: "var(--color-teth)",
    },
    {
      token: "tusdc",
      balance: parseFloat(usdBalances.tusdc),
      fill: "var(--color-tusdc)",
    },
    {
      token: "tusdt",
      balance: parseFloat(usdBalances.tusdt),
      fill: "var(--color-tusdt)",
    },
    {
      token: "tlink",
      balance: parseFloat(usdBalances.tlink),
      fill: "var(--color-tlink)",
    },
  ];
  const chartConfig = {
    balance: {
      label: "USD",
    },
    bnb: {
      label: "BNB",
      color: "#F0B90B", // Yellow
    },
    eth: {
      label: "ETH",
      color: "#627EEA", // Blue
    },
    usdc: {
      label: "USDC",
      color: "#2775CA", // Deep Blue
    },
    usdt: {
      label: "USDT",
      color: "#26A17B", // Green
    },
    link: {
      label: "LINK",
      color: "#2A5ADA", // Royal Blue
    },
    tbnb: {
      label: "tBNB",
      color: "#FFB74D", // Light Orange
    },
    teth: {
      label: "tETH",
      color: "#A785FF", // Light Purple
    },
    tusdc: {
      label: "tUSDC",
      color: "#56CCF2", // Sky Blue
    },
    tusdt: {
      label: "tUSDT",
      color: "#81C784", // Light Green
    },
    tlink: {
      label: "tLINK",
      color: "#8E24AA", // Purple
    },
  } satisfies ChartConfig;
  React.useEffect(() => {
    console.log("CHart data");
    console.log(chartData);

    console.log("CHARt config");
    console.log(chartConfig);
  }, []);
  return (
    <ChartContainer
      config={chartConfig}
      className="mx-auto aspect-square max-h-[250px]"
    >
      <PieChart>
        <ChartTooltip
          cursor={false}
          content={<ChartTooltipContent hideLabel />}
        />
        <Pie
          data={chartData}
          dataKey="balance"
          nameKey="token"
          innerRadius={60}
          strokeWidth={5}
        >
          <Label
            content={({ viewBox }) => {
              if (viewBox && "cx" in viewBox && "cy" in viewBox) {
                return (
                  <text
                    x={viewBox.cx}
                    y={viewBox.cy}
                    textAnchor="middle"
                    dominantBaseline="middle"
                  >
                    <tspan
                      x={viewBox.cx}
                      y={viewBox.cy}
                      className="fill-foreground text-2xl font-bold"
                    >
                      {chartData
                        .reduce((acc, { balance }) => acc + balance, 0)
                        .toFixed(2)
                        .toString() || "0"}
                    </tspan>
                    <tspan
                      x={viewBox.cx}
                      y={(viewBox.cy || 0) + 24}
                      className="fill-muted-foreground"
                    >
                      USD
                    </tspan>
                  </text>
                );
              }
            }}
          />
        </Pie>
      </PieChart>
    </ChartContainer>
  );
}
