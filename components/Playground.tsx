'use client';
import { useEffect, useState } from 'react';
import GenerateWallet from './shared/GenerateWallet';
import { Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import MnemonicCard from './MnemoicCard';
import ActionButtons from './ActionButtons';
import WalletSection from './WalletSection';
import { generateKeys } from '@/lib/utils';

const Playground = () => {
	const [wallets, setWallets] = useState<
		| { type: string; privateKeyEncoded: string; publicKeyEncoded: string; accountIndex: number }[]
		| null
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

		const existingWalletsOfType = wallets.filter((w) => w.type === type);

		if (existingWalletsOfType.length >= 4) {
			toast.error(`You can't add more than 4 ${type} wallets.`);
			return;
		}

		const pathType = type === 'ethereum' ? '60' : '501';

		const existingIndices = existingWalletsOfType.map((w) => w.accountIndex).sort((a, b) => a - b);
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
					<MnemonicCard mnemonics={mnemonics} />
					<ActionButtons deleteAllWallets={deleteAllWallets} />
					<div className='grid lg:grid-cols-2 gap-x-8 gap-y-16 mb-10 justify-items-center w-full'>
						<WalletSection
							type='solana'
							wallets={wallets}
							addNewWallet={addNewWallet}
							deleteWallet={deleteWallet}
						/>
						<WalletSection
							type='ethereum'
							wallets={wallets}
							addNewWallet={addNewWallet}
							deleteWallet={deleteWallet}
						/>
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

export default Playground;
