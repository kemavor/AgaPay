import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "AgaPay - Financial Dashboard",
  description: "Secure payment processing and financial analytics platform",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased bg-gray-50">
        {children}
      </body>
    </html>
  );
}
