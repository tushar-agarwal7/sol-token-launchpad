"use client";


import Balance from "@/components/Balance";
import Airdrop from "@/components/Airdrop";
import SendSol from "@/components/SendSol";
import CreateToken from "@/components/CreateToken";

export default function Home() {

  return (
    <div className="min-h-screen `">
   

            {/* Main Content */}
            <div className="container mx-auto p-6 text-center">
                <h1 className="text-4xl font-extrabold mb-6 ">
                  Solana 
                </h1>
           
            </div>
                 <Balance />
                <Airdrop />
                <SendSol />
                <CreateToken />
      
    </div>
  );
}
