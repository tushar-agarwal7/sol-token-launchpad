import { useConnection, useWallet } from "@solana/wallet-adapter-react";
import { LAMPORTS_PER_SOL } from "@solana/web3.js";
import React, { useState } from "react";
import { Button } from "./ui/button";
import { motion } from "framer-motion";

const Airdrop = () => {
  const [amount, setAmount] = useState<number | string>("");
  const [loading, setLoading] = useState(false);
  const wallet = useWallet();
  const { connection } = useConnection();
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const sendAirdrop = async () => {
    if (wallet.publicKey && amount) {
      try {
        setLoading(true);
        setSuccessMessage(null);
        setErrorMessage(null);

        const lamports = parseFloat(amount as string) * LAMPORTS_PER_SOL;
        const signature = await connection.requestAirdrop(wallet.publicKey, lamports);
        await connection.confirmTransaction(signature, "confirmed");

        setSuccessMessage(`Airdrop successful! ${amount} SOL has been airdropped.`);
        setAmount("");  // Clear the input after successful airdrop
      } catch (error) {
        console.error("Airdrop failed", error);
        setErrorMessage("Airdrop failed. Please try again.");
      } finally {
        setLoading(false);
      }
    } else {
      setErrorMessage("Please enter a valid amount and ensure your wallet is connected.");
    }
  };

  return (
    <motion.div 
      className="flex flex-col items-center justify-top mt-10 min-h-screen text-white p-4"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <motion.h1 
        className="text-5xl font-extrabold mb-8"
        initial={{ y: -50 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
      >
        Airdrop SOL
      </motion.h1>

      <motion.div 
        className="w-full max-w-md bg-gray-800 p-8 rounded-lg shadow-xl"
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <input
          placeholder="Enter amount in SOL"
          type="text"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          className="mb-4 w-full p-3 rounded-lg border border-gray-700 bg-gray-900 focus:outline-none focus:ring-4 focus:ring-gray-500 text-white"
        />

        <Button 
          onClick={sendAirdrop} 
          disabled={loading}
          className="w-full h-12 text-xl font-semibold rounded-full bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 transform transition-all duration-300 ease-in-out hover:scale-105"
        >
          {loading ? (
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ repeat: Infinity, duration: 1 }}
            >
              Airdropping...
            </motion.div>
          ) : (
            "Airdrop SOL"
          )}
        </Button>

        {successMessage && (
          <motion.div 
            className="mt-4 p-3 text-green-500 bg-gray-700 rounded-lg text-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
          >
            {successMessage}
          </motion.div>
        )}

        {errorMessage && (
          <motion.div 
            className="mt-4 p-3 text-red-500 bg-gray-700 rounded-lg text-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
          >
            {errorMessage}
          </motion.div>
        )}
      </motion.div>
    </motion.div>
  );
};

export default Airdrop;
