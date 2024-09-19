import { useConnection, useWallet } from "@solana/wallet-adapter-react";
import React, { useEffect, useState } from "react";

const Balance = () => {
  const [balance, setBalance] = useState<number | null>(null);
  const { connection } = useConnection();
  const { publicKey } = useWallet();

  useEffect(() => {
    const fetchBalance = async () => {
      if (publicKey) {
        try {
          const bal = await connection.getBalance(publicKey);
          setBalance(bal / 1e9);
        } catch (error) {
          console.error("Error fetching balance:", error);
        }
      }
    };
    fetchBalance();
  }, [publicKey, connection]);

  return (
    <div className="mb-6">
      {publicKey ? (
        <p className="text-4xl font-semibold">
         {balance !== null ? `${balance} SOL` : "Loading..."}
        </p>
      ) : (
        <p>Loading...</p>
      )}
    </div>
  );
};

export default Balance;
