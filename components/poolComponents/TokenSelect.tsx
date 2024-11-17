
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from '@/components/ui/select';
import { useTokenAccounts } from '@/lib/utils';
import { Metaplex } from '@metaplex-foundation/js';
import { WalletContextState } from '@solana/wallet-adapter-react';
import { Connection } from '@solana/web3.js';
import Image from 'next/image';
import Token from '../icons/Token';
import Solana from '../icons/Solana';
import { Loader2 } from 'lucide-react';
import { FormControl, FormField, FormItem, FormLabel } from '../ui/form';
import { Control } from 'react-hook-form';

interface TokenSelectProps {
	label: string;
	baseToken: string;
	quoteToken: string;
	wallet: WalletContextState;
	connection: Connection;
	metaplex: Metaplex;
	control: Control<{
		baseToken: string;
		baseAmount: number;
		quoteToken: string;
		quoteAmount: number;
		initialPrice: number;
	}>;
	name: 'baseToken' | 'quoteToken';
}

export default function TokenSelect({
	label,
	baseToken,
	quoteToken,
	wallet,
	connection,
	metaplex,
	control,
	name,
}: TokenSelectProps) {
	const { ownedTokens, isLoading } = useTokenAccounts(connection, wallet, metaplex);

	return (
		<FormField
			control={control}
			name={name}
			render={({ field }) => (
				<FormItem>
					<FormLabel>{label}</FormLabel>
					<FormControl>
						<Select
							onValueChange={field.onChange}
							value={field.value}
							disabled={isLoading}
						>
							<SelectTrigger className='h-14 ps-2 [&>span]:flex [&>span]:items-center [&>span]:gap-2 [&>span_img]:shrink-0  hover:bg-black text-white bg-[#0b0c0b] border-2 rounded-lg border-[#1E1F21] focus-within:border-[#6C6D6D] transition-colors duration-200 ease-out focus-within:bg-[#131313] '>
								<SelectValue
									placeholder={isLoading ? 'Loading...' : 'Select a Token'}
									className='text-white p-2'
								/>
								{isLoading && <Loader2 className='h-4 w-4 animate-spin mr-2' />}
							</SelectTrigger>
							<SelectContent className='[&_*[role=option]>span]:end-2 [&_*[role=option]>span]:start-auto [&_*[role=option]]:pe-8 [&_*[role=option]]:ps-2  text-white  p-2 bg-[#000000] border-2 rounded-lg border-[#1E1F21] focus-within:border-[#0f1212] transition-colors duration-200 ease-out focus-within:bg-[#000000]'>
								{isLoading ? (
									<div className='flex items-center justify-center p-4'>
										<Loader2 className='h-6 w-6 animate-spin' />
									</div>
								) : (
									ownedTokens.map((token) => (
										<SelectItem
											value={token.tokenAddress}
											key={token.tokenAddress}
											disabled={token.tokenAddress == baseToken || token.tokenAddress == quoteToken}
											className=''
										>
											<span className='flex items-center gap-3 w-full'>
												{token.logo ? (
													<Image
														src={token.logo || ''}
														alt={token.symbol || ''}
														className='size-7 object-cover rounded-full'
														width={28}
														height={28}
													/>
												) : token.symbol === 'SOL' ? (
													<Solana className='size-7' />
												) : (
													<Token className='size-7 stroke-white' />
												)}
												<div className='flex flex-col w-full'>
													<div className='flex justify-between w-full gap-5'>
														<span>{token.name ?? 'Unknown'}</span>
														<span>
															{Number(token.tokenAmount).toFixed(3)} {token.symbol}
														</span>
													</div>
													<div className='flex justify-between w-full text-sm text-gray-400'>
														<span>{token.symbol ?? 'Unknown'}</span>
														<span>{`${token.tokenAddress.slice(0, 5)}...${token.tokenAddress.slice(
															-5
														)}`}</span>
													</div>
												</div>
											</span>
										</SelectItem>
									))
								)}
							</SelectContent>
						</Select>
					</FormControl>
				</FormItem>
			)}
		/>
	);
}
