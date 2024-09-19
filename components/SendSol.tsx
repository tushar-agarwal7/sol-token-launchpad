import { WalletNotConnectedError } from "@solana/wallet-adapter-base";
import { useConnection, useWallet } from "@solana/wallet-adapter-react";
import { LAMPORTS_PER_SOL, PublicKey, SystemProgram, Transaction } from "@solana/web3.js";
import React, { useState } from "react";
import { motion } from "framer-motion"; 
import { Button } from "./ui/button"; 

const SendSol = () => {
  const { connection } = useConnection();
  const wallet = useWallet();
  const [amount, setAmount] = useState<number | any>("");
  const [address, setAddress] = useState<string>("");
  const [transactionStatus, setTransactionStatus] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);

  const sendMoney = async () => {
    if (!wallet.publicKey) throw new WalletNotConnectedError();

    if (!amount || !address) {
      alert("Please enter both amount and address");
      return;
    }
    try {
      setLoading(true);
      setTransactionStatus(null); 

      const lamports = await connection.getMinimumBalanceForRentExemption(0);
      const transaction = new Transaction().add(
        SystemProgram.transfer({
          fromPubkey: wallet.publicKey,
          toPubkey: new PublicKey(address),
          lamports: amount * LAMPORTS_PER_SOL,
        })
      );
      const signature = await wallet.sendTransaction(transaction, connection);
      setTransactionStatus("Transaction sent. Waiting for confirmation...");

      await connection.confirmTransaction(signature, "processed");
      setTransactionStatus("Transaction confirmed!");
    } catch (error) {
      console.error("Error sending transaction:", error);
      setTransactionStatus("Transaction failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div 
      className="flex flex-col items-center justify-top  mt-10 min-h-screen  text-white p-6"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
   <motion.h1
        className="text-5xl font-extrabold mb-10 text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-purple-600 shadow-md shadow-purple-500/50 text-center"
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1, ease: "easeOut" }}
      >
        Send Solana
      </motion.h1>

      <motion.div 
        className="w-full max-w-md bg-gray-800 p-8 rounded-lg shadow-lg"
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <input
          type="text"
          placeholder="Recipient's SOL Address"
          value={address}
          onChange={(e) => setAddress(e.target.value)}
          className="mb-4 w-full p-4 rounded-lg bg-gray-900 border border-gray-700 text-white placeholder-gray-500 focus:outline-none focus:ring-4 focus:ring-teal-500 transition-all duration-300"
        />

        <input
          type="text"
          placeholder="Enter Amount in SOL"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          className="mb-4 w-full p-4 rounded-lg bg-gray-900 border border-gray-700 text-white placeholder-gray-500 focus:outline-none focus:ring-4 focus:ring-teal-500 transition-all duration-300"
        />

        <Button
          onClick={sendMoney} 
          disabled={loading}
          className="w-full h-12 text-xl font-semibold rounded-lg bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600 transition-all duration-300 transform hover:scale-105"
        >
          {loading ? (
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ repeat: Infinity, duration: 1 }}
            >
              Sending...
            </motion.div>
          ) : (
            "Send SOL"
          )}
        </Button>

        {transactionStatus && (
          <motion.div 
            className={`mt-6 p-4 rounded-lg text-center ${transactionStatus.includes("confirmed") ? 'bg-green-500' : 'bg-red-500'} text-white`}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
          >
            {transactionStatus}
          </motion.div>
        )}
      </motion.div>
    </motion.div>
  );
};

export default SendSol;
