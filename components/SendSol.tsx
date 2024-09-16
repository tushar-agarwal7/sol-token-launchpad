import { WalletNotConnectedError } from "@solana/wallet-adapter-base";
import { useConnection, useWallet } from "@solana/wallet-adapter-react";
import { LAMPORTS_PER_SOL, PublicKey, SystemProgram, Transaction } from "@solana/web3.js";
import React, { useState } from "react";

const SendSol = () => {
  const { connection } = useConnection();
  const wallet = useWallet();
  const [amount, setAmount] = useState<number | any>("");
  const [address, setAddress] = useState<string>("");
  const [transactionStatus, setTransactionStatus] = useState<string | null>(null);

  const sendMoney = async () => {
    if (!wallet.publicKey) throw new WalletNotConnectedError();

    if (!amount || !address) {
      alert("Please enter both amount and address");
      return;
    }
    try {
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
    }
  };

  return (
    <div className="mb-6">
      <h2 className="text-xl font-bold mb-4">Send SOL</h2>
      <input
        type="text"
        placeholder="Enter Recipient Address"
        value={address}
        onChange={(e) => setAddress(e.target.value)}
        className="mb-4 w-full"
      />
      <input
        type="text"
        placeholder="Enter Amount"
        value={amount}
        onChange={(e) => setAmount(e.target.value)}
        className="mb-4 w-full"
      />
      <button onClick={sendMoney} className="w-full py-2 bg-teal-500 text-white rounded">
        Send Sol
      </button>
      {transactionStatus && <p className="mt-2">{transactionStatus}</p>}
    </div>
  );
};

export default SendSol;
