import { useConnection, useWallet } from '@solana/wallet-adapter-react';
import { PublicKey } from '@solana/web3.js';
import React, { useEffect, useState } from 'react';
import { WalletMultiButton } from '@solana/wallet-adapter-react-ui';
import { motion } from 'framer-motion';

const TokenList = () => {
    const wallet = useWallet();
    const { connection } = useConnection();
    const [tokenAccounts, setTokenAccounts] = useState<any[]>([]);
    const [loading, setLoading] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');

    const fetchTokens = async () => {
        setLoading(true);
        setErrorMessage('');

        try {
            if (!wallet.publicKey) throw new Error('Wallet is not connected');

            const tokenAccountsInfo = await connection.getParsedTokenAccountsByOwner(wallet.publicKey, {
                programId: new PublicKey("TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA"), 
            });

            setTokenAccounts(tokenAccountsInfo.value);
        } catch (e) {
            console.error('Failed to fetch token accounts', e);
            setErrorMessage(e instanceof Error ? e.message : 'An unexpected error occurred.');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (wallet.publicKey) {
            fetchTokens();
        }
    }, [wallet.publicKey]);

    const copyToClipboard = (text: string) => {
        navigator.clipboard.writeText(text);
        alert("Copied to clipboard: " + text);
    };

    return (
        <motion.div
            className="max-w-7xl mb-96 mx-auto mt-12 p-8 bg-gray-900 text-white rounded-lg shadow-2xl"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
        >
            <h1 className="text-4xl font-bold text-center mb-8 text-gradient bg-gradient-to-r from-cyan-400 to-pink-600 bg-clip-text text-transparent">
                My Token
            </h1>

            {wallet.publicKey ? (
                loading ? (
                    <p className="text-center text-pink-300 text-xl">Loading tokens...</p>
                ) : tokenAccounts.length > 0 ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                        {tokenAccounts.map((account, index) => {
                            const { mint, tokenAmount } = account.account.data.parsed.info;
                            const address = account.pubkey.toBase58();
                            const balance = tokenAmount.uiAmount || 0;

                            return (
                                <motion.div
                                    key={address}
                                    className="p-6 bg-gray-800 to-purple-600 rounded-xl shadow-lg flex flex-col justify-between transition-transform transform hover:scale-105"
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ duration: 0.3, delay: index * 0.1 }}
                                >
                                    <div className="flex justify-between items-center mb-4">
                                        <div>
                                            <p className="text-lg font-semibold text-pink-400">
                                                Token Account: {mint.slice(0, 6)}...{mint.slice(-4)}
                                            </p>
                                            <p className="text-sm text-gray-400">
                                                {address.slice(0, 6)}...{address.slice(-4)}
                                            </p>
                                        </div>
                                        <button
                                            className="bg-pink-400 text-gray-900 px-2 py-1 rounded-full hover:bg-pink-500 transition"
                                            onClick={() => copyToClipboard(address)}
                                        >
                                            📋
                                        </button>
                                    </div>
                                    <p className="text-lg text-white">
                                        Balance: {balance}
                                    </p>
                                
                                </motion.div>
                            );
                        })}
                    </div>
                ) : (
                    <p className="text-center text-pink-300 text-xl">No tokens found.</p>
                )
            ) : (
                <div className="text-center">
                    <p className="mb-4 text-pink-300 text-lg">Connect your wallet to see your tokens</p>
                    <WalletMultiButton className="bg-pink-600 text-white rounded-lg shadow-lg hover:bg-pink-700 transition" />
                </div>
            )}

            {errorMessage && (
                <motion.p
                    className="mt-4 text-center text-red-500 text-lg"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.3 }}
                >
                    {errorMessage}
                </motion.p>
            )}
        </motion.div>
    );
};

export default TokenList;
