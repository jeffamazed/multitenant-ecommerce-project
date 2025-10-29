import type { Metadata } from "next";
import "./globals.css";

import { TRPCReactProvider } from "@/trpc/client";
import { NuqsAdapter } from "nuqs/adapters/next/app";

import { dmSans } from "@/lib/fonts";
import { ToasterCustom } from "@/components/shared/ToasterCustom";

export const metadata: Metadata = {
  title: "Monavo",
  description: "Monavo Multitenant E-commerce.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${dmSans.className} antialiased`}>
        <NuqsAdapter>
          <TRPCReactProvider>
            <ToasterCustom />
            {children}
          </TRPCReactProvider>
        </NuqsAdapter>
      </body>
    </html>
  );
}
