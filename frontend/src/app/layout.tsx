"use client";
import "@/styles/globals.css";
import { Inter as FontSans } from "next/font/google";
import { DynamicContextProvider, DynamicWidget } from '@dynamic-labs/sdk-react-core';
import { EthereumWalletConnectors } from "@dynamic-labs/ethereum";
import { cn } from "@/lib/utils";
import { ThemeProvider } from "@/components/theme-provider";
import { Toaster } from "@/components/ui/toaster";
import { ThemeSwitcher } from "@/components/theme-switcher";
import LayoutComponent from "@/components/layout-component";
import { WagmiProvider } from "wagmi";
import { config } from "@/lib/config";
import { DynamicWagmiConnector } from "@dynamic-labs/wagmi-connector";
import { GrandNounsAutoProvider } from "@/components/context";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

const fontSans = FontSans({
  subsets: ["latin"],
  variable: "--font-sans",
});
const queryClient = new QueryClient();

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>

    <DynamicContextProvider
    settings={{
      environmentId: 'c088f783-aa2f-4f36-a6ee-110c9c85588a',
      walletConnectors: [ EthereumWalletConnectors ],
    }}>
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>
      <DynamicWagmiConnector>

          <head />
          <body
            className={cn(
              "h-screen bg-background font-sans antialiased bg-purple-950",
              fontSans.variable
            )}
          >
            <ThemeProvider attribute="class" disableTransitionOnChange>
              <GrandNounsAutoProvider>
                <LayoutComponent>
                  {children}
                  <ThemeSwitcher />
                  <Toaster />
                </LayoutComponent>
              </GrandNounsAutoProvider>
            </ThemeProvider>
          </body>
        </DynamicWagmiConnector>
      </QueryClientProvider>
    </WagmiProvider>
    </DynamicContextProvider>
    </html>

  );
}
