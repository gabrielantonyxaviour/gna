"use client";
import "@/styles/globals.css";
import { Inter as FontSans } from "next/font/google";

import { cn } from "@/lib/utils";
import { ThemeProvider } from "@/components/theme-provider";
import { Toaster } from "@/components/ui/toaster";
import { ThemeSwitcher } from "@/components/theme-switcher";
import LayoutComponent from "@/components/layout-component";
import { WagmiProvider } from "wagmi";
import { config } from "@/lib/config";
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
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>
        <html lang="en" suppressHydrationWarning>
          <head />
          <body
            className={cn(
              "h-screen bg-background font-sans antialiased",
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
        </html>
      </QueryClientProvider>
    </WagmiProvider>
  );
}
