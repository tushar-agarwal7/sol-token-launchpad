"use client";
import {
  WalletModalProvider,
  WalletDisconnectButton,
  WalletMultiButton,
} from "@solana/wallet-adapter-react-ui";
import "@solana/wallet-adapter-react-ui/styles.css";
import { ConnectionProvider, WalletProvider } from "@solana/wallet-adapter-react";
import { useMemo } from "react";
import { clusterApiUrl } from "@solana/web3.js";
import { WalletAdapterNetwork } from "@solana/wallet-adapter-base";
import Balance from "@/components/Balance";
import Airdrop from "@/components/Airdrop";
import SendSol from "@/components/SendSol";
import CreateToken from "@/components/CreateToken";

export default function Home() {
  const network = WalletAdapterNetwork.Devnet;
  const endpoint = useMemo(() => clusterApiUrl(network), [network]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-100 to-gray-300">
      <ConnectionProvider endpoint={endpoint}>
        <WalletProvider wallets={[]} autoConnect>
          <WalletModalProvider>
            <div className="container mx-auto p-6 text-center">
              <div className="bg-white rounded-lg shadow-lg p-8 max-w-md mx-auto">
                <h1 className="text-3xl font-bold mb-4 text-gray-700">
                  Solana Interaction
                </h1>
                <div className="flex justify-center mb-6">
                  <WalletMultiButton className="mx-2" />
                  <WalletDisconnectButton className="mx-2" />
                </div>
                <Balance />
                <Airdrop />
                <SendSol />
                <CreateToken />
              </div>
            </div>
          </WalletModalProvider>
        </WalletProvider>
      </ConnectionProvider>
    </div>
  );
}
