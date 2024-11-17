import { useState } from 'react';
import { useConnection, useWallet } from '@solana/wallet-adapter-react';
import { LAMPORTS_PER_SOL } from '@solana/web3.js';
import { Button } from '@/components/ui/button';
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { toast } from 'sonner';
import { useRPCStore } from '@/app/store/RPCStore';

const AirDrop = () => {
	const [solAmount, setSolAmount] = useState(1);
	const wallet = useWallet();
	const { connection } = useConnection();
	const { cluster } = useRPCStore();

	const handleAirdrop = async () => {
		if (!wallet.publicKey) return;
		try {
			const lamports = Math.min(solAmount, 5) * LAMPORTS_PER_SOL;
			await connection.requestAirdrop(wallet.publicKey, lamports);
			toast.success(`Airdropped ${solAmount} SOL`)
			setSolAmount(1);
		} catch (error) {
			console.error('Error requesting airdrop:', error);
			toast.error('Error while airdropping')
		}
	};

	if (cluster === 'mainnet') {
		return (
			<Button disabled className='bg-white/20 text-gray-500 font-semibold cursor-not-allowed'>
				Airdrop
			</Button>
		);
	}

	return (
		<Dialog>
			<DialogTrigger asChild>
				<Button className='bg-white/80 hover:bg-white text-black font-semibold'>Airdrop</Button>
			</DialogTrigger>
			<DialogContent className='bg-gradient-to-tr from-[#090B0F] to-[#111d17]/80 backdrop-blur-sm border-2 border-gray-600/40 rounded-3xl [font-family:var(--font-geist-mono)]'>
				<DialogHeader>
					<DialogTitle>Request Airdrop</DialogTitle>
					<DialogDescription>
						Request up to 5 SOL to be airdropped to your wallet.
					</DialogDescription>
				</DialogHeader>
				<div className=' space-y-4'>
					<Input
						type='number'
						min='0.1'
						max='5'
						step='0.1'
						value={solAmount}
						onChange={(e) => setSolAmount(Math.min(Number(e.target.value), 5))}
						placeholder='Enter SOL amount (max 5)'
					/>
					<div className='flex w-full justify-center'>
						{' '}
						<DialogTrigger
							onClick={handleAirdrop}
							asChild
						>
							<Button className='border-2  rounded-lg px-5 py-2 bg-white/80 text-black font-medium hover:bg-white'>
								Request Airdrop
							</Button>
						</DialogTrigger>
					</div>
				</div>
			</DialogContent>
		</Dialog>
	);
};

export default AirDrop;
