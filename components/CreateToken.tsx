import {
    ExtensionType,
    LENGTH_SIZE,
    TOKEN_2022_PROGRAM_ID,
    TYPE_SIZE,
    createAssociatedTokenAccountInstruction,
    createInitializeMetadataPointerInstruction,
    createInitializeMint2Instruction,
    createMintToInstruction,
    getAssociatedTokenAddressSync,
    getMinimumBalanceForRentExemptAccount,
    getMintLen,
} from '@solana/spl-token';
import { pack } from '@solana/spl-token-metadata';
import { useConnection, useWallet } from '@solana/wallet-adapter-react';
import { WalletMultiButton } from '@solana/wallet-adapter-react-ui';
import { Keypair, SystemProgram, Transaction } from '@solana/web3.js';
import { UploadClient } from '@uploadcare/upload-client';
import React, { useState } from 'react';
import { motion } from 'framer-motion'; // Animation library

const CreateToken = () => {
    const wallet = useWallet();
    const { connection } = useConnection();
    const [tokenName, setTokenName] = useState('');
    const [symbol, setSymbol] = useState('');
    const [imageLink, setImageLink] = useState('');
    const [amount, setAmount] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');

    const client = new UploadClient({ publicKey: '0135bffd2f7a64d6ad8a' });

    const createMetaData = async (name: string, symbol: string, description: string, image: string) => {
        const metaData = JSON.stringify({ name, symbol, description, image });
        const metaDataFile = new File([metaData], 'metadata.json', { type: 'application/json' });

        try {
            const result = await client.uploadFile(metaDataFile);
            return result.cdnUrl;
        } catch (e) {
            console.error('Failed to upload metadata', e);
        }
    };

    const createToken = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setErrorMessage('');

        try {
            if (!wallet.publicKey) throw new Error('Wallet is not connected');

            const metaDataUrl = await createMetaData(tokenName, symbol, 'Description', imageLink);
            if (!metaDataUrl) throw new Error('Failed to upload metadata');

            const mint = Keypair.generate();
            const decimals = 9;
            const mintLen = getMintLen([ExtensionType.MetadataPointer]);
            const metadata = { mint: mint.publicKey, name: tokenName, symbol: symbol, uri: metaDataUrl, additionalMetadata: [] };
            const metadataLen = TYPE_SIZE + LENGTH_SIZE + pack(metadata).length;
            const lamports = await connection.getMinimumBalanceForRentExemption(mintLen + metadataLen);

            const transaction = new Transaction().add(
                SystemProgram.createAccount({
                    fromPubkey: wallet.publicKey,
                    newAccountPubkey: mint.publicKey,
                    space: mintLen,
                    lamports,
                    programId: TOKEN_2022_PROGRAM_ID,
                }),
                createInitializeMetadataPointerInstruction(mint.publicKey, wallet.publicKey, mint.publicKey, TOKEN_2022_PROGRAM_ID),
                createInitializeMint2Instruction(mint.publicKey, decimals, wallet.publicKey, null, TOKEN_2022_PROGRAM_ID)
            );

            const associatedToken = getAssociatedTokenAddressSync(mint.publicKey, wallet.publicKey, false, TOKEN_2022_PROGRAM_ID);
            transaction.add(
                createAssociatedTokenAccountInstruction(wallet.publicKey, associatedToken, wallet.publicKey, mint.publicKey, TOKEN_2022_PROGRAM_ID)
            );

            const mintAmount = BigInt(parseFloat(amount) * Math.pow(10, decimals));
            const mintTo = createMintToInstruction(mint.publicKey, associatedToken, wallet.publicKey, mintAmount, [], TOKEN_2022_PROGRAM_ID);
            transaction.add(mintTo);

            transaction.feePayer = wallet.publicKey;
            transaction.recentBlockhash = (await connection.getLatestBlockhash()).blockhash;
            transaction.partialSign(mint);

            await wallet.sendTransaction(transaction, connection);
            alert('Token creation successful!');
        } catch (e) {
            console.error('Transaction error:', e);
            setErrorMessage(e instanceof Error ? e.message : 'An unexpected error occurred.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <motion.div
            className="max-w-lg mb-52 mx-auto mt-12 p-8 bg-gray-900 text-white rounded-lg shadow-2xl"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
        >
            <motion.h1
                className="text-5xl font-extrabold mb-10 text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-purple-600 shadow-md shadow-purple-500/50 text-center"
                initial={{ opacity: 0, y: -50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 1, ease: 'easeOut' }}
            >
                Create Your Token
            </motion.h1>

            {wallet.publicKey ? (
                <form onSubmit={createToken} className="space-y-6">
                    <div>
                        <label htmlFor="tokenName" className="block text-teal-200 font-semibold mb-1">
                            Token Name
                        </label>
                        <input
                            type="text"
                            id="tokenName"
                            value={tokenName}
                            onChange={(e) => setTokenName(e.target.value)}
                            className="w-full px-4 py-2 rounded-lg bg-gray-800 text-teal-300 placeholder-teal-400 focus:ring-4 focus:ring-teal-500 transition-all duration-300"
                            required
                            placeholder="e.g. MyToken"
                        />
                    </div>

                    <div>
                        <label htmlFor="symbol" className="block text-teal-200 font-semibold mb-1">
                            Token Symbol
                        </label>
                        <input
                            type="text"
                            id="symbol"
                            value={symbol}
                            onChange={(e) => setSymbol(e.target.value)}
                            className="w-full px-4 py-2 rounded-lg bg-gray-800 text-teal-300 placeholder-teal-400 focus:ring-4 focus:ring-teal-500 transition-all duration-300"
                            required
                            placeholder="e.g. MTK"
                        />
                    </div>

                    <div>
                        <label htmlFor="imageLink" className="block text-teal-200 font-semibold mb-1">
                            Image URL
                        </label>
                        <input
                            type="url"
                            id="imageLink"
                            value={imageLink}
                            onChange={(e) => setImageLink(e.target.value)}
                            className="w-full px-4 py-2 rounded-lg bg-gray-800 text-teal-300 placeholder-teal-400 focus:ring-4 focus:ring-teal-500 transition-all duration-300"
                            required
                            placeholder="https://example.com/image.png"
                        />
                    </div>

                    <div>
                        <label htmlFor="amount" className="block text-teal-200 font-semibold mb-1">
                            Total Supply
                        </label>
                        <input
                            type="number"
                            id="amount"
                            value={amount}
                            onChange={(e) => setAmount(e.target.value)}
                            className="w-full px-4 py-2 rounded-lg bg-gray-800 text-teal-300 placeholder-teal-400 focus:ring-4 focus:ring-teal-500 transition-all duration-300"
                            required
                            placeholder="1000"
                        />
                    </div>

                    <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        type="submit"
                        className={`w-full py-3 mt-4 font-semibold text-lg rounded-lg bg-gradient-to-r from-purple-500 to-teal-500 text-white transition-transform duration-300 hover:from-purple-600 hover:to-teal-600 focus:ring-4 focus:ring-teal-500 ${isLoading ? 'opacity-75 cursor-not-allowed' : ''}`}
                        disabled={isLoading}
                    >
                        {isLoading ? (
                            <div className="flex items-center justify-center space-x-2">
                                <span>Creating Token...</span>
                                <motion.div
                                    className="w-5 h-5 border-t-2 border-b-2 border-white rounded-full animate-spin"
                                    transition={{ ease: 'easeInOut' }}
                                />
                            </div>
                        ) : (
                            'Create and Mint Token'
                        )}
                    </motion.button>

                    {errorMessage && (
                        <motion.p
                            className="mt-4 text-center text-red-500"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ duration: 0.3 }}
                        >
                            {errorMessage}
                        </motion.p>
                    )}
                </form>
            ) : (
                <motion.div
                    className="text-center py-4"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.5 }}
                >
                    <p className="mb-4 text-teal-300">Please connect your wallet to continue.</p>
                    <WalletMultiButton />
                </motion.div>
            )}
        </motion.div>
    );
};

export default CreateToken;
