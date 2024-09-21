'use client';

import { useConnection, useWallet } from '@solana/wallet-adapter-react';
import { LAMPORTS_PER_SOL, PublicKey } from '@solana/web3.js';
import { useEffect, useState } from 'react';
import AirDrop from './AirDrop';
import Send from './Send';
import { Button } from '../ui/button';
import { RotateCw } from 'lucide-react';
import { TOKEN_2022_PROGRAM_ID, TOKEN_PROGRAM_ID } from '@solana/spl-token';
import { toast } from 'sonner';
import { Metaplex } from '@metaplex-foundation/js';
import { Skeleton } from '../ui/skeleton';
import Image from 'next/image';
import Token from '../icons/Token';
import Solana from '../icons/Solana';
import SignMessage from './SignMessage';

const Wallet = () => {
	const wallet = useWallet();
	const { connection } = useConnection();
	const metaplex = Metaplex.make(connection);

	const [ownedTokens, setOwnedTokens] = useState<
		{
			tokenAddress: string;
			tokenAmount: string;
			name?: string;
			symbol?: string;
			logo?: string;
		}[]
	>([]);

	const [isLoading, setIsLoading] = useState(true);

	const getBalanceAndTokenAccounts = async () => {
		if (!wallet.publicKey) return { balance: null, ownedTokens: [] };

		setIsLoading(true);
		try {
			const balance = await connection.getBalance(wallet.publicKey);
			const solBalance = balance / LAMPORTS_PER_SOL;

			const tokenAccounts = await connection.getParsedTokenAccountsByOwner(wallet.publicKey, {
				programId: TOKEN_PROGRAM_ID,
			});

			const token2022Accounts = await connection.getParsedTokenAccountsByOwner(wallet.publicKey, {
				programId: TOKEN_2022_PROGRAM_ID,
			});

			const allTokenAccounts = {
				value: [...tokenAccounts.value, ...token2022Accounts.value],
				context: tokenAccounts.context,
			};

			const ownedTokens = await Promise.all(
				allTokenAccounts.value.map(async (tokenAccountInfo) => {
					const { mint, tokenAmount } = tokenAccountInfo.account.data.parsed.info;
					const mintAddress = new PublicKey(mint);
					const metadataAccount = metaplex.nfts().pdas().metadata({ mint: mintAddress });
					const metadataAccountInfo = await connection.getAccountInfo(metadataAccount);

					let tokenMetadata = {};
					if (metadataAccountInfo) {
						const token = await metaplex.nfts().findByMint({ mintAddress });
						tokenMetadata = {
							name: token.name,
							symbol: token.symbol,
							logo: token.json?.image,
						};
					}

					const decimals = tokenAccountInfo.account.data.parsed.info.tokenAmount.decimals ?? 9;
					const adjustedTokenAmount = (Number(tokenAmount.amount) / 10 ** decimals).toFixed(
						decimals
					);

					return {
						tokenAddress: mintAddress.toBase58(),
						tokenAmount: adjustedTokenAmount,
						...tokenMetadata,
					};
				})
			);

			setIsLoading(false);
			return {
				balance: solBalance,
				ownedTokens: [
					{
						tokenAddress: 'SOL',
						tokenAmount: solBalance.toString(),
						name: 'Solana',
						symbol: 'SOL',
					},
					...ownedTokens,
				],
			};
		} catch (error) {
			console.error('Error fetching balance and token accounts:', error);
			toast.error('Error fetching balance and token accounts');
			setIsLoading(false);
			return { balance: null, ownedTokens: [] };
		}
	};

	useEffect(() => {
		async function fetchBalanceAndTokens() {
			const { ownedTokens } = await getBalanceAndTokenAccounts();
			setOwnedTokens(ownedTokens);
		}
		fetchBalanceAndTokens();
	}, [wallet.publicKey, connection]);

	if (!wallet.publicKey) {
		return (
			<div className='flex [font-family:var(--font-geist-mono)] flex-col items-center justify-center backdrop-blur-sm p-4 border-2 border-green-950/50 bg-gradient-to-tr from-[#000000]/20 to-[#122821]/20 rounded-xl shadow-lg h-60 w-96'>
				<div className="flex flex-col items-center ">
					<div className='text-xs text-gray-500'>No wallet connected</div>
					<div className='text-sm text-gray-200 text-center mt-4	'>
						Please connect a wallet to view your balance and transactions.
					</div>
				</div>
			</div>
		);
	}

	return (
		<>
			<div className='flex [font-family:var(--font-geist-mono)] flex-col items-center justify-center backdrop-blur-sm p-4  border-2 border-green-950/50 bg-gradient-to-tr from-[#000000]/20 to-[#122821]/20 rounded-xl shadow-lg min-w-[340px] max-w-[500px]'>
				<div className="flex justify-between items-center w-full">
					<div></div>
					<Button
						size={'icon'}
						className={`bg-transparent hover:bg-transparent size-4 ${
							isLoading ? 'animate-spin' : ''
						}`}
						onClick={getBalanceAndTokenAccounts}
						disabled={isLoading}
					>
						<RotateCw />
					</Button>
				</div>
				<div>
					<div className='text-xs text-gray-500'>Wallet address</div>
					<div 
						className='text-sm text-gray-200 cursor-pointer'
						onClick={() => {
							const address = wallet.publicKey?.toBase58() || '';
							navigator.clipboard.writeText(address);
							toast.success('Wallet address copied to clipboard');
						}}
					>
						{`${wallet.publicKey.toBase58().slice(0, 12)}...${wallet.publicKey
							.toBase58()
							.slice(-12)}`}
					</div>
				</div>
				<div className='mt-6 flex space-x-4'>
					<AirDrop />
					<Send />
					<SignMessage/>
				</div>
			</div>
			<div className='flex flex-col gap-5 mt-5'>
				{isLoading ? (
					<>
						{[...Array(4)].map((_, index) => (
							<div key={index} className='flex [font-family:var(--font-geist-mono)] items-center justify-between backdrop-blur-sm p-4 border-2 border-green-950/50 bg-gradient-to-tr from-[#000000]/20 to-[#122821]/20 rounded-xl shadow-lg gap-5 min-w-[340px] max-w-[500px]'>
								<div className='flex items-center'>
									<Skeleton className='size-8 rounded-full mr-3 bg-green-900/20' />
									<Skeleton className='h-4 w-28 bg-green-900/20' />
								</div>
								<Skeleton className='h-4 w-20 bg-green-900/20' />
							</div>
						))}
					</>
				) : (
					<>
						{ownedTokens.map((token, index) => (
							<div
								key={index}
								className='flex [font-family:var(--font-geist-mono)] items-center justify-between backdrop-blur-sm p-4 border-2 border-green-950/50 bg-gradient-to-tr from-[#000000]/20 to-[#122821]/20 rounded-xl shadow-lg gap-5 min-w-[300px] max-w-[500px]'
							>
								<div className='flex items-center text-sm'>
									<div className='size-8 rounded-full border border-green-950/60 flex items-center justify-center mr-3'>
										{token.logo ? (
											<Image
												src={token.logo || ''}
												alt={token.symbol || ''}
												className='size-full object-cover rounded-full'
												width={32}
												height={32}
											/>
										) : token.symbol === 'SOL' ? (
											<Solana className='size-full' />
										) : (
											<Token className='size-7 stroke-white' />
										)}
									</div>
									<span className='truncate max-w-[150px] '>{token.name || 'Unknown Token'}</span>
								</div>
								<div className='truncate max-w-[120px] text-sm'>
									{Math.round(parseFloat(token.tokenAmount) * 10000) / 10000}{' '}
									{token.symbol || `${token.tokenAddress?.slice(0, 4)}...`}
								</div>
							</div>
						))}
					</>
				)}
			</div>
		</>
	);
};

export default Wallet;
