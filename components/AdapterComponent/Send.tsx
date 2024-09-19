import { useState } from 'react';
import { useConnection, useWallet } from '@solana/wallet-adapter-react';
import { PublicKey, LAMPORTS_PER_SOL, Transaction, SystemProgram } from '@solana/web3.js';
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
import { Loader } from 'lucide-react';

const Send = () => {
	const wallet = useWallet();
	const [open, setOpen] = useState(false);
	const [recipient, setRecipient] = useState('');
	const [amount, setAmount] = useState('');
	const { connection } = useConnection();
	const { publicKey } = useWallet();
	const [transferring, setIsTransferring] = useState(false);

	const handleSend = async () => {
		if (!publicKey) return;
		try {
			setIsTransferring(true);
			const recipientPubKey = new PublicKey(recipient);
			const transaction = new Transaction().add(
				SystemProgram.transfer({
					fromPubkey: publicKey,
					toPubkey: recipientPubKey,
					lamports: parseFloat(amount) * LAMPORTS_PER_SOL,
				})
			);
			await wallet.sendTransaction(transaction, connection);
			toast.success('SOL transferred successfully');
			setOpen(false);
		} catch (error) {
			console.error('Error sending SOL:', error);

			toast.error( 'Error transferring SOL with valid inputs. try again!!!');
		} finally {
			setIsTransferring(false);
		}
	};

	return (
		<Dialog
			open={open}
			onOpenChange={setOpen}
		>
			<DialogTrigger asChild>
				<Button className='bg-white/80 hover:bg-white text-black font-semibold'>Send</Button>
			</DialogTrigger>
			<DialogContent className='bg-gradient-to-tr from-[#090B0F] to-[#111d17]/80 backdrop-blur-sm border-2 border-gray-600/40 rounded-3xl [font-family:var(--font-geist-mono)]'>
				<DialogHeader>
					<DialogTitle>Send SOL</DialogTitle>
					<DialogDescription>
						Enter the recipient&apos;s address and the amount of SOL to send.
					</DialogDescription>
				</DialogHeader>
				<div className='flex flex-col space-y-4'>
					<Input
						placeholder="Recipient's address"
						value={recipient}
						onChange={(e) => setRecipient(e.target.value)}
					/>
					<Input
						type='number'
						placeholder='Amount in SOL'
						value={amount}
						onChange={(e) => setAmount(e.target.value)}
					/>
					<div className='flex w-full justify-center'>
						<Button
							onClick={handleSend}
							className='border-2  rounded-lg px-5 py-2 bg-white/80 text-black font-medium hover:bg-white'
						>
							{transferring ? <Loader className='size-4 animate-spin' /> : 'Send SOL'}
						</Button>
					</div>
				</div>
			</DialogContent>
		</Dialog>
	);
};

export default Send;
