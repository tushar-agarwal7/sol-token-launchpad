"use client"
import React from 'react'
import { ConnectionProvider, WalletProvider } from "@solana/wallet-adapter-react";
import { useMemo } from "react";
import { clusterApiUrl } from "@solana/web3.js";
import { WalletAdapterNetwork } from "@solana/wallet-adapter-base";
import "@solana/wallet-adapter-react-ui/styles.css";
import { WalletModalProvider } from '@solana/wallet-adapter-react-ui';

const WalletContext = ({children}:{children:React.ReactNode}) => {
    const network = WalletAdapterNetwork.Devnet;
    const endpoint = useMemo(() => clusterApiUrl(network), [network]);
  
  return (
    <ConnectionProvider endpoint={endpoint}>
    <WalletProvider wallets={[]} autoConnect>
      <WalletModalProvider>
   {children}
      </WalletModalProvider>
        </WalletProvider>
      </ConnectionProvider>
        )
}

export default WalletContext