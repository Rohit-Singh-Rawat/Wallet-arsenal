'use client';
import Wallet from '@/components/icons/Wallet';
import { generateKeys } from '@/lib/utils';
import { generateMnemonic, validateMnemonic } from 'bip39';
import { useState } from 'react';
import { toast } from 'sonner';
import { motion } from 'framer-motion';

const GenerateWallet = ({
	Setwallets,
	Setmnemonics,
}: {
	Setwallets: React.Dispatch<
		React.SetStateAction<
			| {
					type: string;
					privateKeyEncoded: string;
					publicKeyEncoded: string;
					accountIndex: number;
			  }[]
			| null
		>
	>;
	Setmnemonics: React.Dispatch<React.SetStateAction<string | null>>;
}) => {
	const [secretPhrase, setSecretPhrase] = useState('');

	const generateWallet = () => {
		let mnemonic = secretPhrase.trim();
		if (mnemonic) {
			if (!validateMnemonic(mnemonic)) {
				toast.error('Invalid recovery phrase. Please try again.');
				return;
			}
		} else {
			mnemonic = generateMnemonic();
		}
		const solWallet = generateKeys({ mnemonic, accountIndex: 0, pathType: '501' });
		const EtherWallet = generateKeys({ mnemonic, accountIndex: 0, pathType: '60' });

		if (solWallet && EtherWallet) {
			const initialWallets = [
				{ ...solWallet, type: 'solana', accountIndex: 0 },
				{ ...EtherWallet, type: 'ethereum', accountIndex: 0 },
			];
			localStorage.setItem('wallets', JSON.stringify(initialWallets));
			localStorage.setItem('mnemonics', mnemonic);
			Setwallets(initialWallets);
			Setmnemonics(mnemonic);
			toast.success('Wallets generated successfully');
		}
	};

	return (
		<div className='flex flex-col items-center justify-center w-full'>
			<motion.div
				className='text-center mb-12 max-w-3xl'
				initial={{ opacity: 0, y: 20 }}
				animate={{ opacity: 1, y: 0 }}
				transition={{ duration: 0.6 }}
			>
				<motion.h2
					className='text-5xl leading-normal font-bold mb-6 bg-gradient-to-r from-[#14F095] to-[#9847FE] bg-clip-text text-transparent'
					initial={{ scale: 0.9 }}
					animate={{ scale: 1 }}
					transition={{ delay: 0.2, duration: 0.5 }}
				>
					Wallet Playground
				</motion.h2>
				<motion.p
					className='text-xl md:text-xl lg:text-2xl text-gray-500'
					initial={{ opacity: 0 }}
					animate={{ opacity: 1 }}
					transition={{ delay: 0.4, duration: 0.5 }}
				>
					Explore the world of blockchain with our interactive wallet generator.
				</motion.p>
			</motion.div>
			<div className='gap-5 w-full flex flex-col items-center justify-center'>
				<input
					type='text'
					className='p-2 lg:w-1/3 w-4/5 border rounded-3xl bg-transparent outline-none border-green-400 px-5 placeholder:text-white/20'
					value={secretPhrase}
					onChange={(e) => setSecretPhrase(e.target.value)}
					placeholder='Enter your secret phrase (or leave blank to generate)'
				/>
				<button
					className='rounded-3xl w-44 p-[10px] px-5 bg-green-400 text-black font-bold flex items-center justify-center gap-2 group transition-all duration-300 active:bg-green-600 overflow-hidden'
					onClick={generateWallet}
				>
					<span className='transition-opacity duration-300 ease-in-out opacity-100 group-hover:opacity-0 delay-300 group-hover:delay-0'>
						Create Wallet
					</span>
					<Wallet className='transition-transform group-hover:-rotate-90 duration-500 group-hover:delay-300 ease-in-out group-hover:scale-[3.2] group-hover:-translate-x-14 group-hover:translate-y-2 size-[18px] fill-black' />
				</button>
			</div>
		</div>
	);
};

export default GenerateWallet;
