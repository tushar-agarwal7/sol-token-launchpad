'use client'
import React from 'react'
import Image from 'next/image'; 
import Link from 'next/link';   
import { WalletDisconnectButton, WalletMultiButton } from "@solana/wallet-adapter-react-ui";
import "@solana/wallet-adapter-react-ui/styles.css";

const Navbar = () => {
  return (
    <div>
      <nav className="shadow backdrop-blur-lg shadow-2xl rounded-md transition-all duration-500 ease-in-out">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          
          <div className="flex items-center">
            <Link href="/" passHref>
              <Image
                src="/logo.png"  
                alt="Logo"
                width={50}       
                height={50}      
                className="drop-shadow-lg cursor-pointer"  
              />
            </Link>
          </div>

          <div className="flex items-center space-x-4">
            
            <WalletMultiButton className="px-6 py-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white font-semibold rounded-full transition-transform duration-500 ease-in-out hover:scale-110 hover:shadow-[0_0_20px_10px_rgba(255,105,180,0.6)] transform-gpu animate-pulse focus:outline-none focus:ring focus:ring-purple-300 focus:ring-opacity-50" />

            <WalletDisconnectButton className="px-6 py-3 bg-gradient-to-r from-red-500 to-yellow-500 text-white font-semibold rounded-full transition-transform duration-500 ease-in-out hover:scale-110 hover:shadow-[0_0_20px_10px_rgba(255,99,71,0.6)] transform-gpu hover:animate-bounce focus:outline-none focus:ring focus:ring-red-300 focus:ring-opacity-50" />
          </div>
        </div>
      </nav>
    </div>
  );
};

export default Navbar;
