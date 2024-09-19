'use client';

import { useConnection, useWallet } from '@solana/wallet-adapter-react';
import { LAMPORTS_PER_SOL, } from '@solana/web3.js';
import { useEffect, useState } from 'react';
import AirDrop from './AirDrop';
import Send from './Send';
import { Button } from '../ui/button';
import { RotateCw } from 'lucide-react';

const Wallet = () => {
	const wallet = useWallet();
	const { connection } = useConnection();

	const [balance, setBalance] = useState<number | null>(null);

	useEffect(() => {
		async function getBalance() {
			if (wallet.publicKey) {
				try {
					const balance = await connection.getBalance(wallet.publicKey);
					console.log(balance);
					setBalance(balance / LAMPORTS_PER_SOL);
				} catch (error) {
					console.error('Error fetching balance:', error);
					setBalance(null);
				}
			}
		}
		getBalance();
	}, [wallet.publicKey, connection]);

	if (!wallet.publicKey) {
		return (
			<div className='flex flex-col items-center justify-center backdrop-blur-sm p-4 h-96 bg-gradient-to-br from-[#141414]/30 to-[#121728]/40 rounded-3xl shadow-lg  [font-family:var(--font-geist-mono)]'>
				<p className='text-lg  text-purple-300 mb-4'>No wallet connected</p>
				<p className='text-sm text-gray-400 max-w-60 text-center'>
					Please connect a wallet to view your balance and transactions.
				</p>
			</div>
		);
	}

	return (
		<div className='flex [font-family:var(--font-geist-mono)] flex-col items-center justify-centerd backdrop-blur-sm p-4 h-96 bg-gradient-to-br from-[#141414]/30 to-[#121728]/40 rounded-3xl shadow-lg '>
			<Button
				size={'icon'}
				className='bg-transparent hover:bg-transparent  size-4 '
			>
				<RotateCw />
			</Button>
			<div className='bg-black/20 p-5 rounded-2xl  space-y-1'>
				<div className='text-xs text-gray-500'>Wallet address</div>
				<div className='text-sm text-gray-200'>
					{`${wallet.publicKey.toBase58().slice(0, 12)}...${wallet.publicKey
						.toBase58()
						.slice(-12)}`}
				</div>
			</div>
			<div className='mt-4 text-sm text-gray-200'>
				Balance: {balance !== null ? `${balance.toFixed(4)} SOL` : 'Loading...'}
			</div>
			<div className='mt-6 flex space-x-4'>
				<AirDrop />
				<Send />
			</div>
		</div>
	);
};

export default Wallet;
