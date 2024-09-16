import { ExtensionType, LENGTH_SIZE, TOKEN_2022_PROGRAM_ID, TYPE_SIZE, createAssociatedTokenAccount, createAssociatedTokenAccountInstruction, createInitializeInstruction, createInitializeMetadataPointerInstruction, createInitializeMint2Instruction, createMint, createMintToInstruction, getAssociatedTokenAddressSync, getMinimumBalanceForRentExemptAccount, getMintLen } from '@solana/spl-token';
import { pack } from '@solana/spl-token-metadata';
import { useConnection, useWallet } from '@solana/wallet-adapter-react'
import { WalletMultiButton } from '@solana/wallet-adapter-react-ui';
import { Keypair, SystemProgram, Transaction } from '@solana/web3.js';
import React, { useState } from 'react'

const CreateToken = () => {
    const wallet=useWallet();
    const {connection}=useConnection();
    const [tokenName,setTokenName]=useState('')
    const [symbol,setSymbol]=useState('')
    const [imageLink,setImageLink]=useState('')
    const [amount,setAmount]=useState('')
    const [isLoading,setIsLoading]=useState(false)
    

    const createToken=async(e:React.FormEvent)=>{
     e.preventDefault()
     setIsLoading(true)
     try{
        if(!wallet.publicKey){
            throw new Error("Wallet is not connected")
        }
        
        const mint=Keypair.generate();
        const decimals=9;
        const mintLen = getMintLen([ExtensionType.MetadataPointer]);
        const metadata={
            mint:mint.publicKey,
            name:tokenName,
            symbol:symbol,
            uri:imageLink,
            additionalMetadata: [],
        }
        const metadataLen = TYPE_SIZE + LENGTH_SIZE + pack(metadata).length;
        const lamports = await connection.getMinimumBalanceForRentExemption(mintLen + metadataLen);
        const transaction=new Transaction().add(
            SystemProgram.createAccount({
                fromPubkey:wallet.publicKey,
                newAccountPubkey:mint.publicKey,
                space:mintLen,
                lamports,
                programId:TOKEN_2022_PROGRAM_ID,
            }),
            createInitializeMetadataPointerInstruction(mint.publicKey,wallet.publicKey,mint.publicKey,TOKEN_2022_PROGRAM_ID),
            createInitializeMint2Instruction(mint.publicKey,decimals,wallet.publicKey,null,TOKEN_2022_PROGRAM_ID),
            createInitializeInstruction({
                programId:TOKEN_2022_PROGRAM_ID,
                metadata:mint.publicKey,
                updateAuthority:wallet.publicKey,
                mint:mint.publicKey,
                mintAuthority:wallet.publicKey,
                name:tokenName,
                symbol:symbol,
                uri:imageLink
            })

        )
  

        const associatedToken=getAssociatedTokenAddressSync(mint.publicKey,wallet.publicKey,false,TOKEN_2022_PROGRAM_ID)

        transaction.add(
            createAssociatedTokenAccountInstruction(
                wallet.publicKey,
                associatedToken,
                wallet.publicKey,
                mint.publicKey,
                TOKEN_2022_PROGRAM_ID,

            )
        )
        const mintAmount=BigInt(parseFloat(amount) * Math.pow(10,decimals))
        const mintTo=createMintToInstruction(mint.publicKey,associatedToken,wallet.publicKey,mintAmount,[],TOKEN_2022_PROGRAM_ID)
             transaction.add(mintTo);
        transaction.feePayer = wallet.publicKey;
        transaction.recentBlockhash = (await connection.getLatestBlockhash()).blockhash;
        transaction.partialSign(mint);

        await wallet.sendTransaction(transaction, connection);
        console.log( `mint account ${mint.publicKey}`)
        
     alert("done")

     }
     catch (e) {
        console.error("Transaction error:", e);
    }
     setIsLoading(false)
    }
    
  return (
    <div>

        <h1>Create Tokens</h1>
        {wallet.publicKey?(
          <div>
         <form onSubmit={createToken}>
            <div>
            <label htmlFor="tokenName">Token Name</label>
            <input type="text" id="tokenName" value={tokenName} onChange={(e)=>{
                setTokenName(e.target.value)
            }} required/>
            </div>
            <div>
             <label htmlFor="symbol">Token Symbol</label>
             <input type="text" id="symbol" value={symbol} onChange={(e)=>{
                setSymbol(e.target.value)
             }} required />
            </div>
          <div>
            <label htmlFor="imageLink">Image URL</label>
            <input type="text" id="imageLink" value={imageLink} onChange={(e)=>{
                setImageLink(e.target.value)
            }} required />
          </div>

          <div>
            <label htmlFor="amount">Supply</label>
            <input type="text" id="amount" value={amount} onChange={(e)=>{
                setAmount(e.target.value)
            }} required />
          </div>
          <button type='submit' >
            {isLoading ?(
                <div>
                    Creating...
                </div>
            ):(
                <div>
                Create and Mint token
                </div>
            )}
          </button>
         </form>
          </div>
        )
        :(
            <div>
                <p>connect your wallet</p>
                <WalletMultiButton/>
            </div>
        )}

    </div>
  )
}

export default CreateToken