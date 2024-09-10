import { motion } from 'framer-motion';
import Copy from '../icons/AnimatedCopy';
import Ethereum from '../icons/Ethereum';
import Solana from '../icons/Solana';
import { Eye, EyeOff, Trash2 } from 'lucide-react';
import { useState } from 'react';
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
import { Skeleton } from '@/components/ui/skeleton';
import { toast } from 'sonner';
import { useBalance } from '@/lib/utils';
const walletVariants = {
	initial: { opacity: 0, y: 20, scale: 0.9 },
	animate: { opacity: 1, y: 0, scale: 1 },
	exit: { opacity: 0, y: -20 },
};
const Wallet = ({
	type,
	walletName,
	publicKeyEncoded,
	privateKeyEncoded,
	onDelete,
}: {
	type: string;
	walletName: string;
	publicKeyEncoded: string;
	privateKeyEncoded: string;
	onDelete: () => void;
}) => {
	const [showPrivateKey, setShowPrivateKey] = useState(false);

	const {
		data: balance,
		isLoading,	
	} = useBalance(type as 'ethereum' | 'solana', publicKeyEncoded);

	return (
		<motion.div
			className={`flex [font-family:var(--font-geist-sans)] min-w-96 max-w-[480px] my-2 gap-4 flex-col items-center justify-center bg-gradient-to-br from-white ${
				type === 'ethereum'
					? 'via-teal-600/70 via-70% to-emerald-700/70'
					: 'via-green-400/70 via-70% to-emerald-700/70'
			} rounded-3xl pt-4 p-[1px]`}
			variants={walletVariants}
			initial='initial'
			animate='animate'
			exit='exit'
			transition={{
				type: 'spring',
				stiffness: 100,
				damping: 15,
				mass: 1,
			}}
			layout
		>
			<div className='flex justify-between items-center w-full px-5'>
				<div className='flex items-center justify-start gap-2 w-full'>
					{type === 'solana' ? (
						<Solana className='size-9' />
					) : (
						<Ethereum className='size-8 border border-black rounded-full p-1' />
					)}
					<div className='flex h-8 flex-col items-start justify-center text-left'>
						<span className='text-[10px] text-black/90'>{walletName}</span>
						{isLoading ? (
							<Skeleton className='h-4 w-20' />
						) : (
							<span className='text-sm text-black font-semibold text-left'>
								 {balance?.toString() || '0.00'} {type === 'ethereum' ? 'ETH' : 'SOL'}
							</span>
						)}
					</div>
				</div>
				<AlertDialog>
					<AlertDialogTrigger asChild>
						<Trash2 className='size-9 stroke-red-100 active:scale-95 ease-in transition-all  cursor-pointer bg-orange-800/40 border border-red-400/50 rounded-lg p-2' />
					</AlertDialogTrigger>
					<AlertDialogContent className='bg-black border-white/10'>
						<AlertDialogHeader>
							<AlertDialogTitle>Are you sure?</AlertDialogTitle>
							<AlertDialogDescription>
								This action cannot be undone. This will permanently delete this wallet.
							</AlertDialogDescription>
						</AlertDialogHeader>
						<AlertDialogFooter>
							<AlertDialogCancel className='border-white/10'>Cancel</AlertDialogCancel>
							<AlertDialogAction
								onClick={onDelete}
								className='bg-red-800 '
							>
								Delete
							</AlertDialogAction>
						</AlertDialogFooter>
					</AlertDialogContent>
				</AlertDialog>
			</div>
			<div className='flex flex-col items-center justify-center bg-black rounded-3xl p-4 py-6 w-full gap-6'>
				<div className='space-y-2 w-full'>
					<div className='text-sm text-white/50'>Public Key</div>
					<div
						onClick={() => {
							navigator.clipboard.writeText(publicKeyEncoded);
							toast.success('Wallet address copied to clipboard');
						}}
						className='relative cursor-pointer group/copy text-sm text-black/90 font-bold bg-white/90 p-2 rounded-lg flex items-center justify-center gap-2'
					>
						<Copy />
						<span className='truncate'> {publicKeyEncoded}</span>
					</div>
				</div>
				<div className='space-y-2 w-full'>
					<div className='text-sm text-white/50'>Private Key</div>
					<div className='relative text-sm text-black/90 font-bold bg-white/90 p-2 rounded-lg flex items-center gap-2'>
						<button
							onClick={() => setShowPrivateKey(!showPrivateKey)}
							className='transition-transform duration-300 ease-in-out hover:scale-110 active:scale-95'
						>
							{showPrivateKey ? <EyeOff className='size-5' /> : <Eye className='size-5' />}
						</button>
						<span
							className={`overflow-scroll  transition-all  ease-in-out ${
								showPrivateKey ? 'blur-none duration-300' : 'blur-sm'
							}`}
						>
							{showPrivateKey ? privateKeyEncoded : '•'.repeat(privateKeyEncoded.length)}
						</span>
					</div>
				</div>
			</div>
		</motion.div>
	);
};

export default Wallet;
