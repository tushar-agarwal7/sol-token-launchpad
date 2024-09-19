import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import WalletContext from "@/components/WalletContext";
import NavBar from "@/components/Navbar";
import Footer from "@/components/Footer";

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

export const metadata: Metadata = {
  title: "Solana Token LaunchPad",
  description: "Tushar Agarwal",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-gradient-to-br from-gray-900 to-black text-gray-100`}
      >
          <head>
  
  <link rel="icon" href="/logo.png" type="image/png" />
</head>

        <WalletContext>
          <NavBar/>
        {children}

        </WalletContext>
        <Footer/>
      </body>
    </html>
  );
}
