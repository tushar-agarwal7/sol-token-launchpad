'use client'
import { FaWallet, FaCoins, FaRocket, FaDollarSign, FaHandshake } from 'react-icons/fa';
import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { useConnection, useWallet } from '@solana/wallet-adapter-react';
import Balance from '@/components/Balance';
import { Button } from '@/components/ui/moving-border';


export default function WalletUI() {
  const router = useRouter();
  const wallet = useWallet();
  const connection = useConnection();

  const handleAirdrop = () => router.push('/airdrop');
  const handleSend = () => router.push('/send');
  const handleToken = () => router.push('/createToken');
  const allTokens = () => router.push('/alltokens');
  const viewTransactions = () => router.push('/transactions');

  return (
    <div className="min-h-screen flex flex-col items-center py-10 bg-gray-900 text-white">
      <motion.h1
        className="text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-purple-600 shadow-md shadow-purple-500/50 text-center"
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1, ease: "easeOut" }}
      >
        Solana Token Launchpad
      </motion.h1>

      <motion.div
        className="relative mb-10 bg-gradient-to-r from-gray-900 via-gray-800 to-gray-700 p-8 mt-10 rounded-3xl shadow-2xl w-full max-w-md border border-white/20 overflow-hidden"
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.8 }}
      >
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-purple-600 to-transparent opacity-50 rounded-3xl -z-10"></div>
        <p className="text-6xl font-extrabold text-white">
          <Balance />
        </p>
        <p className="text-sm text-gray-300 mt-2">You are currently in Testnet Mode</p>
      </motion.div>
      <Button
        borderRadius="1.75rem"
        onClick={handleAirdrop}
        className=" dark:bg-slate-900  border-neutral-200 text-2xl font-bold dark:border-slate-800"
      >
  <span className="relative font-sans">Airdrop</span>
        </Button>
  

      <div className="grid grid-cols-2 gap-8 mt-20 w-full max-w-3xl">
        <motion.div
          className=" bg-gradient-to-r from-gray-900 via-gray-800 to-gray-700 p-6 rounded-xl shadow-lg cursor-pointer transform transition-all"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <FaWallet className="text-5xl text-white mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-white text-center">Receive</h3>
        </motion.div>

        <motion.div
          className=" bg-gradient-to-r from-gray-900 via-gray-800 to-gray-700 p-6 rounded-xl shadow-lg cursor-pointer transform transition-all"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={handleSend}
        >
          <FaRocket className="text-5xl text-white mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-white text-center">Send</h3>
        </motion.div>

        <motion.div
          className=" bg-gradient-to-r from-gray-900 via-gray-800 to-gray-700 p-6 rounded-xl shadow-lg cursor-pointer transform transition-all"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={handleToken}
        >
          <FaCoins className="text-5xl text-white mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-white text-center">Create Token</h3>
        </motion.div>

        <motion.div
          className=" bg-gradient-to-r from-gray-900 via-gray-800 to-gray-700 p-6 rounded-xl shadow-lg cursor-pointer transform transition-all"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={allTokens}
        >
          <FaDollarSign className="text-5xl text-white mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-white text-center">All Tokens</h3>
        </motion.div>
      </div>

     

    </div>
  );
}
