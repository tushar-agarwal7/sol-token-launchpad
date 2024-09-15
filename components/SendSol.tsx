import { WalletNotConnectedError } from '@solana/wallet-adapter-base';
import { useConnection, useWallet } from '@solana/wallet-adapter-react'
import { LAMPORTS_PER_SOL, PublicKey, SystemProgram, Transaction } from '@solana/web3.js';
import React, { useState } from 'react'

const SendSol = () => {
    const {connection}=useConnection();
    const wallet=useWallet();
    const [amount,setAmount]=useState<number| any>();
    const [address,setAddress]=useState<string>('');
    const [transactionStatus,setTransactionStatus]=useState<string | null>(null)

    const sensMoney=async()=>{
        if (!wallet.publicKey) throw new WalletNotConnectedError();

        if(!amount || !address){
            alert("Please enter both amount and address");
            return;
            }
            try{
                const lamports = await connection.getMinimumBalanceForRentExemption(0);
                const transaction =new Transaction().add(
                    SystemProgram.transfer({
                      fromPubkey:wallet.publicKey,
                      toPubkey:new  PublicKey(address),
                      lamports:amount * LAMPORTS_PER_SOL,
                    })
                )
                const signature = await wallet.sendTransaction(transaction, connection);
                setTransactionStatus("Transaction sent. Waiting for confirmation...");
    
                await connection.confirmTransaction(signature, 'processed');
                setTransactionStatus("Transaction confirmed!");
            }
            catch(error){
                console.error("errorr is",error)
                setTransactionStatus("Transaction failed. Please try again.");            }
      
    }

  return (
    <div>

        <h1> send solana </h1>
        <input type="text" placeholder='Enter Reciever Address' value={address} onChange={(e)=>{
            setAddress(e.target.value)
        }} />

        <input type="text" placeholder='Enter amount' value={amount} onChange={(e)=>{
            setAmount(e.target.value)
        }}/>
        <button onClick={sensMoney}> Send Sol</button>
        {transactionStatus && <p>{transactionStatus}</p>}

    </div>
  )
}

export default SendSol