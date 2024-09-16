import { useConnection, useWallet } from "@solana/wallet-adapter-react";
import { LAMPORTS_PER_SOL } from "@solana/web3.js";
import React, { useState } from "react";
import { Button } from "./ui/button";

const Airdrop = () => {
  const [amount, setAmount] = useState<number | string>("");
  const [loading, setLoading] = useState(false);
  const wallet = useWallet();
  const { connection } = useConnection();

  const sendAirdrop = async () => {
    if (wallet.publicKey && amount) {
      try {
        setLoading(true);
        const lamports = parseFloat(amount as string) * LAMPORTS_PER_SOL;
        const signature = await connection.requestAirdrop(wallet.publicKey, lamports);
        await connection.confirmTransaction(signature, "confirmed");
        alert(`Airdrop successful! ${amount} SOL has been airdropped.`);
      } catch (error) {
        console.error("Airdrop failed", error);
        alert("Airdrop failed");
      } finally {
        setLoading(false);
      }
    }
  };

  return (
    <div className="mb-6">
      <input
        placeholder="Amount"
        type="text"
        value={amount}
        onChange={(e) => setAmount(e.target.value)}
        className="mb-4 w-full"
      />
      <Button onClick={sendAirdrop} disabled={loading}>
        {loading ? "Airdropping..." : "Airdrop SOL"}
      </Button>
    </div>
  );
};

export default Airdrop;
