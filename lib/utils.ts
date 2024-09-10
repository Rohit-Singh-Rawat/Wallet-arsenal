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
