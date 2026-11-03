import type { Metadata } from "next";

import "./globals.css";

export const metadata: Metadata = {
  title: "BookNook",
  description: "A small online library for the neighbourhood.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
