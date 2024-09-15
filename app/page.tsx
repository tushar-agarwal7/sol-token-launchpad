"use client"
import {
  WalletModalProvider,
  WalletDisconnectButton,
  WalletMultiButton
} from '@solana/wallet-adapter-react-ui';
import '@solana/wallet-adapter-react-ui/styles.css';

import { ConnectionProvider, WalletProvider } from '@solana/wallet-adapter-react';
import { useMemo } from 'react';
import { clusterApiUrl } from '@solana/web3.js';
import { WalletAdapterNetwork } from '@solana/wallet-adapter-base';
import Balance from '@/components/Balance';
import Airdrop from '@/components/Airdrop';
import SendSol from '@/components/SendSol';



export default function Home() {
  const network = WalletAdapterNetwork.Devnet
  const endpoint = useMemo(() => clusterApiUrl(network), [network]);
  return (
<ConnectionProvider endpoint={endpoint}>
            <WalletProvider wallets={[]} autoConnect>
                <WalletModalProvider>
                    <WalletMultiButton />
                    <WalletDisconnectButton />
                    <Balance/>
                    <Airdrop/>
                    <SendSol/>
                </WalletModalProvider>
            </WalletProvider>
        </ConnectionProvider>
  );
}
