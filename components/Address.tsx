import { useWallet } from '@solana/wallet-adapter-react';
import React from 'react';
import { motion } from 'framer-motion';
import { WalletMultiButton } from '@solana/wallet-adapter-react-ui';

const Address = () => {
    const wallet = useWallet();
    const publicKey = wallet.publicKey?.toBase58();

    return (
        <motion.div
            className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-b from-gray-900 via-black to-gray-900 text-white"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1 }}
        >
            <motion.h1
                className="text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-purple-600 mb-10 shadow-md shadow-purple-500/50 text-center"
                initial={{ y: -50, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 1 }}
            >
                Solana Wallet Information
            </motion.h1>

            <div className="bg-gray-800 p-8 rounded-3xl shadow-2xl border border-gray-700 mb-6 text-center max-w-lg w-full">
                {wallet.connected ? (
                    <>
                        <motion.p
                            className="text-xl font-semibold mb-4 bg-gradient-to-r from-green-400 to-blue-500 text-transparent bg-clip-text"
                            initial={{ scale: 0.9, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            transition={{ duration: 0.8 }}
                        >
                            Wallet Connected 🎉
                        </motion.p>
                        <motion.p
                            className="text-lg text-gray-300"
                            initial={{ opacity: 0, x: -50 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.6 }}
                        >
                            Your public key is:
                        </motion.p>
                        <motion.p
                            className="mt-4 text-2xl font-mono font-bold text-pink-500 break-all"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 0.3 }}
                        >
                            {publicKey}
                        </motion.p>

                        <motion.button
                            className="mt-6 bg-gradient-to-r from-pink-500 to-purple-600 px-6 py-2 rounded-full font-semibold text-white shadow-lg hover:shadow-purple-700/50 transition-all"
                            onClick={() => navigator.clipboard.writeText(publicKey || '')}
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.95 }}
                        >
                            Copy Public Key 📋
                        </motion.button>
                    </>
                ) : (
                    <>
                        <motion.p
                            className="text-xl font-semibold mb-4 text-pink-500"
                            initial={{ scale: 0.9, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            transition={{ duration: 0.8 }}
                        >
                            Wallet not connected 😕
                        </motion.p>
                        <p className="text-gray-400">Connect your Solana wallet to view your public key.</p>
                        <WalletMultiButton className="mt-6 bg-pink-600 text-white px-4 py-2 rounded-lg shadow-lg hover:bg-pink-700 transition" />
                    </>
                )}
            </div>

            <motion.div
                className="bg-gray-800 p-6 rounded-xl shadow-xl mt-10 border border-gray-700 max-w-md w-full text-center"
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 1 }}
            >
                <p className="text-xl font-semibold text-cyan-500">Wallet Status</p>
                <p className="text-lg text-gray-400 mt-2">
                    {wallet.connected ? '✅ Connected' : '❌ Not Connected'}
                </p>
                <p className="text-sm text-gray-500 mt-2">
                    {wallet.connected ? `Connected to network: ${wallet.wallet?.adapter.name}` : 'Please connect your wallet.'}
                </p>
            </motion.div>
        </motion.div>
    );
};

export default Address;
