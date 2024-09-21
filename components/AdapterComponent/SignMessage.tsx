import { useState } from 'react';
import {  useWallet } from '@solana/wallet-adapter-react';
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
import { ed25519 } from '@noble/curves/ed25519';
const SignMessage = () => {
	const {  signMessage } = useWallet();
	const [open, setOpen] = useState(false);
	const [message, setMessage] = useState('');
	const { publicKey } = useWallet();
	const [signing, setIsSigning] = useState(false);

	const handleSend = async () => {
		if (!publicKey) return;
		if (!signMessage) {
			toast.error('Wallet does not support message signing!');
			return;
		}

		if (!message.trim()) {
			toast.error('Message cannot be empty');
			return;
		}
		try {
			setIsSigning(true);
			const encodedMessage = new TextEncoder().encode(message);
			const signature = await signMessage(encodedMessage);
			if (ed25519.verify(signature, encodedMessage, publicKey.toBytes())) {
				toast.success('Message signed successfully');
				setOpen(false);
			} else {
				toast.error('Signature verification failed');
			}
		} catch (error) {
			console.error('Error signing message:', error);
			toast.error('Error signing message. Please try again.');
		} finally {
			setIsSigning(false);
		}
	};

	return (
		<Dialog
			open={open}
			onOpenChange={setOpen}
		>
			<DialogTrigger asChild>
				<Button className='bg-white/80 hover:bg-white text-black font-semibold'>
					Sign Message
				</Button>
			</DialogTrigger>
			<DialogContent className='bg-gradient-to-tr from-[#090B0F] to-[#111d17]/80 backdrop-blur-sm border-2 border-gray-600/40 rounded-3xl [font-family:var(--font-geist-mono)]'>
				<DialogHeader>
					<DialogTitle>Send SOL</DialogTitle>
					<DialogDescription>Enter the message you want to sign.</DialogDescription>
				</DialogHeader>
				<div className='flex flex-col space-y-4'>
					<Input
						type='text'
						placeholder='Enter your message'
						value={message}
						onChange={(e) => setMessage(e.target.value)}
					/>
					<div className='flex w-full justify-center'>
						<Button
							onClick={handleSend}
							className='border-2  rounded-lg px-5 py-2 bg-white/80 text-black font-medium hover:bg-white'
						>
							{signing ? <Loader className='size-4 animate-spin' /> : 'Sign message'}
						</Button>
					</div>
				</div>
			</DialogContent>
		</Dialog>
	);
};

export default SignMessage;
