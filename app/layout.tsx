import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });

export const metadata: Metadata = {
  title: "Royal Cars — Self Drive Car Rental in Bhubaneswar",
  description: "Premium self-drive car rental in Bhubaneswar. Book hatchbacks, sedans, SUVs at the best rates. Est. 2024.",
  keywords: "self drive car rental bhubaneswar, rent a car bhubaneswar, royal cars",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={inter.variable}>
      <body>{children}</body>
    </html>
  );
}
