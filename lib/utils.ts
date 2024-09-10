import { mnemonicToSeedSync } from 'bip39';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { derivePath } from 'ed25519-hd-key';
import { Keypair } from '@solana/web3.js';
import bs58 from 'bs58';
import nacl from 'tweetnacl';
import { toast } from 'sonner';
import { Wallet } from 'ethers';
import { HDNodeWallet } from 'ethers';
import axios, { AxiosResponse } from 'axios';
import { useQuery } from 'react-query';

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
