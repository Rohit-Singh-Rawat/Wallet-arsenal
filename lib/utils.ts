import { mnemonicToSeedSync } from 'bip39';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { derivePath } from 'ed25519-hd-key';
import { Keypair, LAMPORTS_PER_SOL } from '@solana/web3.js';
import bs58 from 'bs58';
import nacl from 'tweetnacl';
import { toast } from 'sonner';
import { Wallet } from 'ethers';
import { HDNodeWallet } from 'ethers';
import axios, { AxiosResponse } from 'axios';
import { useQuery } from 'react-query';
import { TOKEN_2022_PROGRAM_ID, TOKEN_PROGRAM_ID } from '@solana/spl-token';
import { PublicKey } from '@solana/web3.js';
import { useEffect, useState } from 'react';
import { Metaplex } from '@metaplex-foundation/js';
import { WalletContextState } from '@solana/wallet-adapter-react';
import { Connection } from '@solana/web3.js';

interface EthBalanceRequest {
	id: number;
	jsonrpc: string;
	method: string;
	params: [string, string];
}

interface EthBalanceResponse {
	jsonrpc: string;
	id: number;
	result: string;
}

interface SolanaBalanceRequest {
	id: number;
	jsonrpc: string;
	method: string;
	params: [string];
}

interface SolanaBalanceResponse {
	jsonrpc: string;
	id: number;
	result: {
		context: {
			apiVersion: string;
			slot: number;
		};
		value: number;
	};
}

export function cn(...inputs: ClassValue[]) {
	return twMerge(clsx(inputs));
}
export const generateKeys = ({
	mnemonic,
	accountIndex,
	pathType,
}: {
	mnemonic: string;
	accountIndex: number;
	pathType: string;
}) => {
	try {
		const seed = mnemonicToSeedSync(mnemonic);
		const path = `m/44'/${pathType}'/0'/0'/${accountIndex}'`;

		let publicKeyEncoded: string;
		let privateKeyEncoded: string;
		if (pathType === '501') {
			const derivedSeed = derivePath(path, seed.toString('hex')).key;
			const { secretKey } = nacl.sign.keyPair.fromSeed(derivedSeed);
			const keypair = Keypair.fromSecretKey(secretKey);

			privateKeyEncoded = bs58.encode(secretKey);
			publicKeyEncoded = keypair.publicKey.toBase58();
		} else if (pathType === '60') {
			const hdNode = HDNodeWallet.fromSeed(seed);
			const child = hdNode.derivePath(path);
			const privateKey = child.privateKey;
			privateKeyEncoded = privateKey;

			const wallet = new Wallet(privateKey);
			publicKeyEncoded = wallet.address;
		} else {
			toast.error('Unsupported path type.');
			return null;
		}
		return { privateKeyEncoded, publicKeyEncoded };
	} catch (error) {
		toast.error('failed to generate wallet.');
		return null;
	}
};

const createEthBalanceRequest = (address: string): EthBalanceRequest => ({
	jsonrpc: '2.0',
	id: 1,
	method: 'eth_getBalance',
	params: [address, 'latest'],
});

const createSolanaBalanceRequest = (address: string): SolanaBalanceRequest => ({
	jsonrpc: '2.0',
	id: 1,
	method: 'getBalance',
	params: [address],
});

const createConfig = (data: EthBalanceRequest | SolanaBalanceRequest, url: string) => ({
	method: 'post' as const,
	maxBodyLength: Infinity,
	url: url,
	headers: {
		'Content-Type': 'application/json',
	},
	data: JSON.stringify(data),
});

const fetchEthBalance = async (address: string): Promise<number> => {
	const data = createEthBalanceRequest(address);
	const config = createConfig(
		data,
		'https://eth-holesky.g.alchemy.com/v2/' + process.env.NEXT_PUBLIC_ALCHEMY_API_KEY
	);
	const response: AxiosResponse<EthBalanceResponse> = await axios.request(config);
	console.log(JSON.stringify(response.data));
	return Number(parseInt(response.data.result, 16)) / Math.pow(10, 18);
};

const fetchSolanaBalance = async (address: string): Promise<number> => {
	const data = createSolanaBalanceRequest(address);
	const config = createConfig(
		data,
		'https://solana-devnet.g.alchemy.com/v2/' + process.env.NEXT_PUBLIC_ALCHEMY_API_KEY
	);
	const response: AxiosResponse<SolanaBalanceResponse> = await axios.request(config);
	console.log(JSON.stringify(response.data));
	return response.data.result.value / Math.pow(10, 9);
};

export const useBalance = (type: 'ethereum' | 'solana', address: string) => {
	const queryFn = type === 'ethereum' ? fetchEthBalance : fetchSolanaBalance;

	return useQuery<number>(['balance', type, address], () => queryFn(address), {
		retry: 3,
		staleTime: 60000, // 1 minute
		onError: (error) => {
			console.error(`Error fetching ${type} balance:`, error);
		},
	});
};

export const useTokenAccounts = (
	connection: Connection,
	wallet: WalletContextState,
	metaplex: Metaplex
) => {
	const [isLoading, setIsLoading] = useState(false);
	const [Tokens, setTokens] = useState<{
		ownedTokens: {
			tokenAddress: string;
			tokenAmount: string;
			name?: string;
			symbol?: string;
			logo?: string;
		}[];
	}>({ ownedTokens: [] });

	const fetchTokens = async () => {
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

			const result = {
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

			setTokens(result);
			setIsLoading(false);
			return result;
		} catch (error) {
			console.error('Error fetching balance and token accounts:', error);
			toast.error('Error fetching balance and token accounts');
			setIsLoading(false);
			return { balance: null, ownedTokens: [] };
		}
	};
	useEffect(() => {
		fetchTokens();
	}, [wallet.publicKey, connection]);

	return {
		...Tokens,
		isLoading,
		refetch: fetchTokens,
	};
};
