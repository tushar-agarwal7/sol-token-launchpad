"use client";
import { useState, useEffect } from "react";
import { useWallet, useConnection } from "@solana/wallet-adapter-react";
import { motion } from "framer-motion";
import { PublicKey } from "@solana/web3.js";
import { getMint, getAccount, getTokenMetadata, TokenAccountNotFoundError, TOKEN_2022_PROGRAM_ID } from "@solana/spl-token";
import { FaSpinner } from "react-icons/fa";
import { WalletMultiButton } from "@solana/wallet-adapter-react-ui";

interface Token {
  name: string;
  symbol: string;
  address: string;
  image?: string;
}

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.3,
    },
  },
};

const itemVariants = {
  hidden: { y: 20, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: {
      type: "spring",
      stiffness: 100,
      damping: 12,
    },
  },
};

export default function TokenList() {
  const [tokens, setTokens] = useState<Token[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const { publicKey } = useWallet();
  const { connection } = useConnection();

  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      alert("Address copied to clipboard: " + text);
    } catch (err) {
      console.error("Failed to copy: ", err);
      alert("Failed to copy address");
    }
  };

  useEffect(() => {
    const fetchTokens = async () => {
      if (!publicKey) return;

      setIsLoading(true);
      try {
        const tokenAccounts = await connection.getTokenAccountsByOwner(publicKey, { programId: TOKEN_2022_PROGRAM_ID });

        const fetchedTokens = await Promise.all(
          tokenAccounts.value.map(async ({ pubkey }) => {
            try {
              const accountInfo = await getAccount(connection, pubkey, undefined, TOKEN_2022_PROGRAM_ID);
              const mintInfo = await getMint(connection, accountInfo.mint, undefined, TOKEN_2022_PROGRAM_ID);

              if (mintInfo.mintAuthority?.equals(publicKey)) {
                const metadata = await getTokenMetadata(connection, accountInfo.mint);
                if (metadata) {
                  let image = undefined;
                  if (metadata.uri) {
                    try {
                      const metadataJson = await fetch(metadata.uri).then((res) => res.json());
                      image = metadataJson.image;
                    } catch (error) {
                      console.error("Error fetching metadata JSON:", error);
                    }
                  }
                  return {
                    name: metadata.name,
                    symbol: metadata.symbol,
                    address: accountInfo.mint.toBase58(),
                    image: image,
                  };
                }
              }
            } catch (error) {
              if (!(error instanceof TokenAccountNotFoundError)) {
                console.error("Error fetching token info:", error);
              }
            }
            return null;
          })
        );

        setTokens(fetchedTokens.filter((token): token is NonNullable<typeof token> => token !== null));
      } catch (error) {
        console.error("Error fetching tokens:", error);
        alert("Failed to fetch tokens. Please try again.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchTokens();
  }, [publicKey, connection]);

  return (
    <motion.div className="max-w-7xl mx-auto p-8 bg-gradient-to-r from-blue-900 to-gray-900 text-white rounded-lg shadow-2xl ring-2 ring-purple-800/60" initial="hidden" animate="visible" variants={containerVariants}>
      <motion.h1 className="text-6xl font-bold text-center mb-12 text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-pink-600 drop-shadow-lg" initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.2 }}>
        My Tokens
      </motion.h1>

      {!publicKey ? (
        <motion.div className="text-center bg-gradient-to-br from-purple-900/70 to-pink-900/70 rounded-2xl p-8 shadow-lg hover:shadow-purple-900/90" variants={itemVariants}>
          <p className="text-2xl text-gray-200 mb-4">Please connect your wallet to view your tokens.</p>
          <WalletMultiButton className="bg-gradient-to-r from-purple-500 to-pink-500 text-white font-bold py-3 px-6 rounded-full hover:from-purple-600 hover:to-pink-600 transition-colors duration-300 shadow-md hover:shadow-lg ring-2 ring-pink-400" />
        </motion.div>
      ) : isLoading ? (
        <motion.div className="flex flex-col items-center justify-center" variants={itemVariants}>
          <FaSpinner className="animate-spin text-6xl text-purple-500 mb-4 drop-shadow-lg" />
          <p className="text-2xl text-gray-300">Loading your tokens...</p>
        </motion.div>
      ) : tokens.length > 0 ? (
        <motion.div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8" variants={containerVariants}>
          {tokens.map((token, index) => (
            <motion.div key={index} className="p-6 bg-gray-800 rounded-xl shadow-lg hover:shadow-pink-500/50 transition-transform transform hover:scale-105 ring-2 ring-purple-500/40" variants={itemVariants}>
              <div className="flex justify-between items-center mb-4">
                <div>
                  <p className="text-lg font-semibold text-pink-400 drop-shadow-md">
                    {token.name} ({token.symbol})
                  </p>
                  <p className="text-sm text-gray-400">{token.address.slice(0, 6)}...{token.address.slice(-4)}</p>
                </div>
                <button className="bg-pink-400 text-gray-900 px-2 py-1 rounded-full hover:bg-pink-500 transition ring-1 ring-white/60 hover:ring-white/90" onClick={() => copyToClipboard(token.address)}>
                  📋
                </button>
              </div>
              <img src={token.image || "/default-token-icon.png"} alt={token.name} className="w-20 h-20 mb-4 rounded-full border-2 border-pink-400" />
            </motion.div>
          ))}
        </motion.div>
      ) : (
        <motion.div className="text-center bg-gradient-to-br from-purple-900/70 to-pink-900/70 rounded-2xl p-8 shadow-lg hover:shadow-purple-900/90" variants={itemVariants}>
          <p className="text-2xl text-gray-300 mb-4">You don't have any tokens yet.</p>
        </motion.div>
      )}
    </motion.div>
  );
}
