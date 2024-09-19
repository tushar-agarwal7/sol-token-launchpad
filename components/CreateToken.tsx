import { ExtensionType, LENGTH_SIZE, TOKEN_2022_PROGRAM_ID, TYPE_SIZE, createAssociatedTokenAccountInstruction, createInitializeMetadataPointerInstruction, createInitializeMint2Instruction, createMintToInstruction, getAssociatedTokenAddressSync, getMinimumBalanceForRentExemptAccount, getMintLen } from '@solana/spl-token';
import { pack } from '@solana/spl-token-metadata';
import { useConnection, useWallet } from '@solana/wallet-adapter-react';
import { WalletMultiButton } from '@solana/wallet-adapter-react-ui';
import { Keypair, SystemProgram, Transaction } from '@solana/web3.js';
import { UploadClient } from '@uploadcare/upload-client';
import React, { useState } from 'react';

const CreateToken = () => {
    const wallet = useWallet();
    const { connection } = useConnection();
    const [tokenName, setTokenName] = useState('');
    const [symbol, setSymbol] = useState('');
    const [imageLink, setImageLink] = useState('');
    const [amount, setAmount] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');
    
    const client = new UploadClient({ publicKey: process.env.REACT_APP_PUBLIC_KEY! });
    
    const createMetaData = async (name: string, symbol: string, description: string, image: string) => {
        const metaData = JSON.stringify({ name, symbol, description, image });
        const metaDataFile = new File([metaData], "metadata.json", { type: "application/json" });

        try {
            const result = await client.uploadFile(metaDataFile);
            console.log("Successfully uploaded", result);
            return result.cdnUrl;
        } catch (e) {
            console.error("Failed to upload metadata", e);
        }
    };

    const createToken = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setErrorMessage(''); 

        try {
            if (!wallet.publicKey) throw new Error("Wallet is not connected");

            const metaDataUrl = await createMetaData(tokenName, symbol, "Description", imageLink);
            if (!metaDataUrl) throw new Error("Failed to upload metadata");

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
            alert("Token creation successful!");

        } catch (e) {
            console.error("Transaction error:", e);
            setErrorMessage(e instanceof Error ? e.message : "An unexpected error occurred.");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="max-w-md mx-auto p-6 bg-white rounded-lg shadow-lg mt-10">
            <h1 className="text-2xl font-bold mb-6 text-center">Create Your Token</h1>

            {wallet.publicKey ? (
                <form onSubmit={createToken} className="space-y-4">
                    <div>
                        <label htmlFor="tokenName" className="block text-gray-700">Token Name</label>
                        <input type="text" id="tokenName" value={tokenName} onChange={(e) => setTokenName(e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-teal-500 focus:border-teal-500"
                            required placeholder="e.g. MyToken" />
                    </div>

                    <div>
                        <label htmlFor="symbol" className="block text-gray-700">Token Symbol</label>
                        <input type="text" id="symbol" value={symbol} onChange={(e) => setSymbol(e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-teal-500 focus:border-teal-500"
                            required placeholder="e.g. MTK" />
                    </div>

                    <div>
                        <label htmlFor="imageLink" className="block text-gray-700">Image URL</label>
                        <input type="url" id="imageLink" value={imageLink} onChange={(e) => setImageLink(e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-teal-500 focus:border-teal-500"
                            required placeholder="https://example.com/image.png" />
                    </div>

                    <div>
                        <label htmlFor="amount" className="block text-gray-700">Total Supply</label>
                        <input type="number" id="amount" value={amount} onChange={(e) => setAmount(e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-teal-500 focus:border-teal-500"
                            required placeholder="1000" />
                    </div>

                    <button type="submit" className={`w-full py-2 text-white rounded-lg bg-teal-600 hover:bg-teal-700 focus:ring-4 focus:ring-teal-500 ${isLoading && 'opacity-75 cursor-not-allowed'}`}
                        disabled={isLoading}>
                        {isLoading ? "Creating Token..." : "Create and Mint Token"}
                    </button>

                    {errorMessage && <p className="text-red-600 text-center mt-4">{errorMessage}</p>}
                </form>
            ) : (
                <div className="text-center">
                    <p className="mb-4 text-gray-700">Connect your wallet to create a token</p>
                    <WalletMultiButton />
                </div>
            )}
        </div>
    );
};

export default CreateToken;
