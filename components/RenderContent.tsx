'use client';
import { useEffect, useState } from 'react';
import GenerateWallet from './shared/GenerateWallet';
import MnemoicCard from './MnemoicCard';
import { Loader2, Trash2 } from 'lucide-react';
import WalletComponent from './shared/Wallet';
import { Button } from './ui/button';
import { generateKeys } from '@/lib/utils';
import { toast } from 'sonner';
import {
	AlertDialog,
	AlertDialogAction,
	AlertDialogCancel,
	AlertDialogContent,
	AlertDialogDescription,
	AlertDialogFooter,
	AlertDialogHeader,
	AlertDialogTitle,
	AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import {  AnimatePresence } from 'framer-motion';

const RenderContent = () => {
	const [wallets, setWallets] = useState<
		{ type: string; privateKeyEncoded: string; publicKeyEncoded: string; accountIndex: number }[] | null
	>(null);
	const [mnemonics, setMnemonics] = useState<string | null>(null);
	const [isLoading, setIsLoading] = useState(true);

	const deleteAllWallets = () => {
		localStorage.removeItem('wallets');
		localStorage.removeItem('mnemonics');
		setWallets(null);
		setMnemonics(null);
		toast.success('All wallets have been deleted successfully.');
	};

	const addNewWallet = (type: 'ethereum' | 'solana') => {
		if (!mnemonics || !wallets) return;
		
		const existingWalletsOfType = wallets.filter(w => w.type === type);
		
		if (existingWalletsOfType.length >= 5) {
			toast.error(`You can't add more than 5 ${type} wallets.`);
			return;
		}

		const pathType = type === 'ethereum' ? '60' : '501';
		
		const existingIndices = existingWalletsOfType.map(w => w.accountIndex).sort((a, b) => a - b);
		let newIndex = 0;
		for (let i = 0; i <= existingIndices.length; i++) {
			if (i !== existingIndices[i]) {
				newIndex = i;
				break;
			}
		}

		const newWallet = generateKeys({
			mnemonic: mnemonics,
			accountIndex: newIndex,
			pathType,
		});
		if (newWallet) {
			const updatedWallets = [...wallets, { ...newWallet, type, accountIndex: newIndex }];
			localStorage.setItem('wallets', JSON.stringify(updatedWallets));
			setWallets(updatedWallets);
			toast.success(`New ${type} wallet added successfully.`);
		}
	};

	const deleteWallet = (type: string, publicKey: string) => {
		if (wallets) {
			const updatedWallets = wallets.filter(
				(wallet) => !(wallet.type === type && wallet.publicKeyEncoded === publicKey)
			);
			localStorage.setItem('wallets', JSON.stringify(updatedWallets));
			setWallets(updatedWallets);
			toast.success(`${type} wallet deleted successfully.`);
		}
	};

	useEffect(() => {
		const storedWallets = localStorage.getItem('wallets');
		const storedMnemonics = localStorage.getItem('mnemonics');
		if (storedWallets) {
			setWallets(JSON.parse(storedWallets));
		}
		if (storedMnemonics) {
			setMnemonics(storedMnemonics);
		}
		setIsLoading(false);
	}, []);

	if (isLoading) {
		return (
			<div className='flex justify-center items-center h-screen'>
				<Loader2 className='h-8 w-8 animate-spin text-green-500' />
			</div>
		);
	}

	return (
		<>
			{wallets && mnemonics ? (
				<>
					<MnemoicCard mnemonics={mnemonics} />
					<div className='flex justify-center md:justify-end w-full space-x-4 my-6'>
						<AlertDialog>
							<AlertDialogTrigger asChild>
								<button className='rounded-lg w-44 p-[10px] px-5 bg-red-600 text-white font-bold flex items-center justify-center gap-2 group transition-all duration-300 active:bg-red-900 overflow-hidden'>
									<span className='transition-opacity duration-300 ease-in-out opacity-100 group-hover:opacity-0 delay-300 group-hover:delay-0'>
										Delete Wallets
									</span>
									<Trash2 className='transition-transform duration-500 group-hover:delay-300 ease-in-out group-hover:scale-[3.2] group-hover:-translate-x-14 group-hover:translate-y-2 size-[18px]' />
								</button>
							</AlertDialogTrigger>
							<AlertDialogContent className='bg-black border-white/10'>
								<AlertDialogHeader>
									<AlertDialogTitle>Are you sure?</AlertDialogTitle>
									<AlertDialogDescription>
										This action cannot be undone. This will permanently delete all wallets.
									</AlertDialogDescription>
								</AlertDialogHeader>
								<AlertDialogFooter>
									<AlertDialogCancel className='border-white/10'>Cancel</AlertDialogCancel>
									<AlertDialogAction
										onClick={deleteAllWallets}
										className='bg-red-600'
									>
										Delete
									</AlertDialogAction>
								</AlertDialogFooter>
							</AlertDialogContent>
						</AlertDialog>
					</div>
					<div className='grid lg:grid-cols-2 gap-x-8 gap-y-16 mb-10 justify-items-center w-full'>
						<div className='w-full max-w-md space-y-14'>
							<div className='flex items-center justify-between mb-4 px-2'>
								<h2 className='text-3xl font-bold'>Solana Wallets</h2>
								<Button
									onClick={() => addNewWallet('solana')}
									className='bg-white text-black font-semibold hover:bg-white/80'
									disabled={wallets.filter(w => w.type === 'solana').length >= 5}
								>
									Add Wallet
								</Button>
							</div>
							<div className='grid gap-8'>
								<AnimatePresence>
									{wallets.filter((wallet) => wallet.type === 'solana').length > 0 ? (
										wallets
											.filter((wallet) => wallet.type === 'solana')
											.map((wallet, index) => (
												<WalletComponent
													key={wallet.publicKeyEncoded}
													type={wallet.type}
													publicKeyEncoded={wallet.publicKeyEncoded}
													privateKeyEncoded={wallet.privateKeyEncoded}
													walletName={`Solana Wallet ${index + 1}`}
													onDelete={() => deleteWallet(wallet.type, wallet.publicKeyEncoded)}
												/>
											))
									) : (
										<div className='text-center text-gray-500'>No Solana wallets exist</div>
									)}
								</AnimatePresence>
							</div>
						</div>
						<div className='w-full max-w-md space-y-14'>
							<div className='flex items-center  justify-between  px-2'>
								<h2 className='text-3xl font-bold'>Ethereum Wallets</h2>
								<Button
									onClick={() => addNewWallet('ethereum')}
									className='bg-white text-black font-semibold hover:bg-white/80'
									disabled={wallets.filter(w => w.type === 'ethereum').length >= 5}
								>
									Add Wallet
								</Button>
							</div>
							<div className='grid gap-8'>
								<AnimatePresence>
									{wallets.filter((wallet) => wallet.type === 'ethereum').length > 0 ? (
										wallets
											.filter((wallet) => wallet.type === 'ethereum')
											.map((wallet, index) => (
											
													<WalletComponent
													key={wallet.publicKeyEncoded}
														type={wallet.type}
														publicKeyEncoded={wallet.publicKeyEncoded}
														privateKeyEncoded={wallet.privateKeyEncoded}
														walletName={`Ethereum Wallet ${index + 1}`}
														onDelete={() => deleteWallet(wallet.type, wallet.publicKeyEncoded)}
													/>
											))
									) : (
										<div className='text-center text-gray-500'>No Ethereum wallets exist</div>
									)}
								</AnimatePresence>
							</div>
						</div>
					</div>
				</>
			) : (
				<GenerateWallet
					Setwallets={setWallets}
					Setmnemonics={setMnemonics}
				/>
			)}
		</>
	);
};

export default RenderContent;
