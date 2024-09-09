'use client';
import Wallet from '@/components/icons/Wallet';
import { generateKeys } from '@/lib/utils';
import { generateMnemonic, validateMnemonic } from 'bip39';
import { useState } from 'react';
import { toast } from 'sonner';
const GenerateWallet = () => {
	const [secretPhrase, setSecretPhrase] = useState('');
	const [mnemonic, setMnemonic] = useState('');

	const generateWallet = () => {
		let mnemonic = secretPhrase.trim();
		console.log('object');
		if (mnemonic) {
			if (!validateMnemonic(mnemonic)) {
				toast.error('Invalid recovery phrase. Please try again.');
				return;
			}
		} else {
			mnemonic = generateMnemonic();
		}
		setMnemonic(mnemonic);
		const solWallet = generateKeys({ mnemonic, accountIndex: 0, pathType: '501' });
		const EtherWallet = generateKeys({ mnemonic, accountIndex: 0, pathType: '60' });
		console.log(solWallet, EtherWallet);
	};

	return (
		<>
			<div className='text-5xl xl:w-2/3 w-full text-center font-bold pt-[30vh]'>
				Craft{' '}
				<span className='bg-gradient-to-r bg-clip-text text-transparent from-[#14F095] to-[#9847FE]'>
					wallets
				</span>
				, master blockchain transactions.
			</div>
			<div className='gap-5 w-full flex flex-col items-center justify-center'>
				<input
					type='text'
					className='p-2 lg:w-1/3 w-4/5 border rounded-3xl bg-transparent outline-none border-green-400 px-5 placeholder:text-white/20 '
					value={secretPhrase}
					onChange={(e) => setSecretPhrase(e.target.value)}
					placeholder='Enter your secret phrase (or leave blank to generate)'
				/>
				<button
					className='rounded-3xl w-44 p-[10px] px-5 bg-green-400 text-black font-bold  flex items-center justify-center gap-2 group transition-all  duration-300 active:bg-green-600 overflow-hidden'
					onClick={generateWallet}
				>
					<span className='transition-opacity duration-300 ease-in-out opacity-100 group-hover:opacity-0 delay-300 group-hover:delay-0'>
						Create Wallet
					</span>
					<Wallet className='transition-transform  group-hover:-rotate-90 duration-500 group-hover:delay-300 ease-in-out group-hover:scale-[3.2] group-hover:-translate-x-14  group-hover:translate-y-2 size-[18px] fill-black' />
				</button>
			</div>
		</>
	);
};
export default GenerateWallet;
