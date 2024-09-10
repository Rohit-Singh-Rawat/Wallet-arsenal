import Link from 'next/link';
import Eth from './icons/Eth';
import Sol from './icons/Sol';
import { Trash2 } from 'lucide-react';
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

type ActionButtonsProps = {
    deleteAllWallets: () => void;
};

const ActionButtons = ({ deleteAllWallets }: ActionButtonsProps) => {
    return (
        <div className='flex justify-center lg:justify-between flex-wrap gap-5 w-full space-x-4 my-6 '>
            <div className='flex space-x-4'>
                <Link
                    href='https://cloud.google.com/application/web3/faucet/ethereum/holesky'
                    target='_blank'
                    passHref
                >
                    <button className='rounded-lg w-44 p-[10px] px-5 bg-gradient-to-r from-[#8C8C8C] via-[#343434] to-[#141414] text-white font-bold flex items-center justify-center gap-2 group transition-all duration-300 active:bg-gradient-to-r active:from-[#7C7C7C] active:via-[#242424] active:to-[#040404] overflow-hidden'>
                        <span className='transition-opacity duration-300 ease-in-out opacity-100 group-hover:opacity-0 delay-300 group-hover:delay-0'>
                            Receive ETH
                        </span>
                        <Eth className='transition-transform duration-500 group-hover:delay-300 ease-in-out group-hover:scale-[3.2] group-hover:-translate-x-14 group-hover:translate-y-2 size-[18px] fill-current' />
                    </button>
                </Link>
                <Link
                    href='https://faucet.solana.com/'
                    target='_blank'
                    passHref
                >
                    <button className='rounded-lg w-44 p-[10px] px-5 text-white/80 font-bold flex items-center justify-center gap-2 group transition-all duration-300 bg-gradient-to-r from-[#14F095] to-[#9847FE] overflow-hidden'>
                        <span className='transition-opacity duration-300 ease-in-out opacity-100 group-hover:opacity-0 delay-300 group-hover:delay-0'>
                            Receive SOL
                        </span>
                        <Sol className='transition-transform duration-500 group-hover:delay-300 ease-in-out group-hover:scale-[3.2] group-hover:-translate-x-14 group-hover:translate-y-2 size-[18px] fill-current' />
                    </button>
                </Link>
            </div>
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
    );
};

export default ActionButtons;
