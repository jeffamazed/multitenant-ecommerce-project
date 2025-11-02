import type { Metadata } from "next";
import { throttle } from "nuqs/server";
import "./globals.css";

import { TRPCReactProvider } from "@/trpc/client";
import { NuqsAdapter } from "nuqs/adapters/next/app";

import { dmSans } from "@/lib/fonts";
import { ToasterCustom } from "@/components/shared/toaster-custom";

export const metadata: Metadata = {
  title: "Monavo",
  description: "Monavo Multitenant E-commerce.",
  icons: {
    icon: "/icons/favicon.ico",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${dmSans.className} antialiased`}>
        <NuqsAdapter
          defaultOptions={{
            limitUrlUpdates: throttle(500),
          }}
        >
          <TRPCReactProvider>
            <ToasterCustom />
            {children}
          </TRPCReactProvider>
        </NuqsAdapter>
      </body>
    </html>
  );
}
