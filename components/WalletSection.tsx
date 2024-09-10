import { Button } from './ui/button';
import WalletComponent from './shared/Wallet';
import { AnimatePresence } from 'framer-motion';

type WalletSectionProps = {
    type: 'ethereum' | 'solana';
    wallets: { type: string; privateKeyEncoded: string; publicKeyEncoded: string; accountIndex: number }[];
    addNewWallet: (type: 'ethereum' | 'solana') => void;
    deleteWallet: (type: string, publicKey: string) => void;
};

const WalletSection = ({ type, wallets, addNewWallet, deleteWallet }: WalletSectionProps) => {
    const filteredWallets = wallets.filter((wallet) => wallet.type === type);

    return (
			<div
				className={`w-full max-w-md space-y-14 ${
					type === 'ethereum' ? 'lg:justify-self-end' : 'lg:justify-self-start'
				}`}
			>
				<div className='flex items-center justify-between mb-4 px-2'>
					<h2 className='text-3xl font-bold'>
						{type === 'ethereum' ? 'Ethereum' : 'Solana'} Wallets
					</h2>
					<Button
						onClick={() => addNewWallet(type)}
						className='bg-white text-black font-semibold hover:bg-white/80'
						disabled={filteredWallets.length >= 4}
					>
						Add Wallet
					</Button>
				</div>
				<div className='grid gap-8'>
					<AnimatePresence>
						{filteredWallets.length > 0 ? (
							filteredWallets.map((wallet, index) => (
								<WalletComponent
									key={wallet.publicKeyEncoded}
									type={wallet.type}
									publicKeyEncoded={wallet.publicKeyEncoded}
									privateKeyEncoded={wallet.privateKeyEncoded}
									walletName={`${type === 'ethereum' ? 'Ethereum' : 'Solana'} Wallet ${index + 1}`}
									onDelete={() => deleteWallet(wallet.type, wallet.publicKeyEncoded)}
								/>
							))
						) : (
							<div className='text-center text-gray-500'>
								No {type === 'ethereum' ? 'Ethereum' : 'Solana'} wallets exist
							</div>
						)}
					</AnimatePresence>
				</div>
			</div>
		);
};

export default WalletSection;
