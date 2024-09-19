'use client'

import React from 'react'
import { motion } from 'framer-motion';
import { FaGithub } from 'react-icons/fa'; 

const Footer = () => {
  return (
    <motion.footer
      className="w-full py-8 bg-gray-900 text-center  shadow-lg shadow-purple-500/30"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 1 }}
    >
      <div className="max-w-7xl mx-auto px-4">
        <p className="text-lg font-bold text-transparent bg-clip-text bg-gradient-to-r from-teal-400 to-cyan-500">
          Built with ❤️ by Tushar
        </p>

        <p className="text-sm text-gray-400 mt-2">
          Testnet Mode | All transactions are simulated
        </p>

        <div className="mt-4">
          <a
            href="https://github.com/tushar-agarwal7"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center space-x-2 text-gray-400 hover:text-teal-400 transition-all duration-300"
          >
            <FaGithub className="w-6 h-6" />
            <span className="font-semibold">View on GitHub</span>
          </a>
        </div>
      </div>


    </motion.footer>
  )
}

export default Footer;
