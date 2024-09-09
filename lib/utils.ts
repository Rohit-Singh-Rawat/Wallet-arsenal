import { mnemonicToSeedSync } from 'bip39';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { derivePath } from 'ed25519-hd-key';
import { Keypair } from '@solana/web3.js';
import bs58 from 'bs58';
import nacl from 'tweetnacl';
import { toast } from 'sonner';
import { ethers } from 'ethers';

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
		const derivedSeed = derivePath(path, seed.toString('hex')).key;

		let publicKeyEncoded: string;
		let privateKeyEncoded: string;
		if (pathType === '501') {
			const { secretKey } = nacl.sign.keyPair.fromSeed(derivedSeed);
			const keypair = Keypair.fromSecretKey(secretKey);

			privateKeyEncoded = bs58.encode(secretKey);
			publicKeyEncoded = keypair.publicKey.toBase58();
      
		} else if (pathType === '60') {
			const privateKey = Buffer.from(derivedSeed).toString('hex');
			privateKeyEncoded = privateKey;

			const wallet = new ethers.Wallet(privateKey);
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
