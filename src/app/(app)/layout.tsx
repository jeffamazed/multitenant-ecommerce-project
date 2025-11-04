import type { Metadata } from "next";
import "./globals.css";

import { TRPCReactProvider } from "@/trpc/client";
import { NuqsAdapter } from "nuqs/adapters/next/app";

import { dmSans } from "@/lib/fonts";
import { ToasterCustom } from "@/components/shared/toaster-custom";

export const metadata: Metadata = {
  title: {
    template: "Monavo | %s",
    default: "Monavo",
  },
  description:
    "Monavo: A multitenant e-commerce platform to explore and manage products across multiple stores.",
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
