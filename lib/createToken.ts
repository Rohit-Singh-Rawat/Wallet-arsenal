import { createV1, mplTokenMetadata, TokenStandard } from '@metaplex-foundation/mpl-token-metadata';
import { createUmi } from '@metaplex-foundation/umi-bundle-defaults';
import { irysUploader } from '@metaplex-foundation/umi-uploader-irys';
import { Connection, Transaction } from '@solana/web3.js';
import { walletAdapterIdentity } from '@metaplex-foundation/umi-signer-wallet-adapters';
import { WalletContextState } from '@solana/wallet-adapter-react';
import { generateSigner, percentAmount, PublicKey, publicKey } from '@metaplex-foundation/umi';
import { base58 } from '@metaplex-foundation/umi/serializers';
import {
	createAssociatedTokenAccountInstruction,
	createMintToInstruction,
	getAssociatedTokenAddressSync,
	TOKEN_2022_PROGRAM_ID,
} from '@solana/spl-token';
import { PublicKey as SolanaPublicKey } from '@solana/web3.js';
import { toast } from 'sonner';

const SPL_TOKEN_2022_PROGRAM_ID: PublicKey = publicKey(
	'TokenzQdBNbLqP5VEhdkAS6EPFLC1PHnBqCXEpPxuEb'
);

export const createToken = async (
	connection: Connection,
	wallet: WalletContextState,
	name: string,
	symbol: string,
	imageUri: string,
	mintAmount: number
) => {
	if (!wallet.publicKey) return { signature: null, tokenPublicKey: null };
	const umi = createUmi(connection)
		.use(walletAdapterIdentity(wallet))
		.use(mplTokenMetadata())
		.use(irysUploader());

	const external_metadata = {
		name: name,
		symbol: symbol,
		description: 'This is a spl_token on Solana',
		image: imageUri,
	};

	toast.loading('Please sign the message to upload metadata...', { id: 'uploadMetadata' });
	const metadataUri = (await umi.uploader.uploadJson(external_metadata)).replace(
		'arweave.net',
		'gateway.irys.xyz'
	);
	toast.success('Metadata uploaded successfully!', { id: 'uploadMetadata' });
	console.log(metadataUri);
	const mintKeypair = generateSigner(umi);
	console.log(mintKeypair);

	toast.loading('Please sign the transaction to create the token...', { id: 'createToken' });
	const txid = await createV1(umi, {
		mint: mintKeypair,
		printSupply: { __kind: 'Limited', fields: [BigInt(mintAmount * Math.pow(10, 9))] },
		authority: umi.identity,
		name: name,
		symbol: symbol,
		uri: metadataUri,
		sellerFeeBasisPoints: percentAmount(0),
		decimals: 9,
		tokenStandard: TokenStandard.Fungible,
		collection: null,
		uses: null,
		splTokenProgram: SPL_TOKEN_2022_PROGRAM_ID,
		primarySaleHappened: true,
		isMutable: true,
	}).send(umi);
	toast.success('Token created successfully!', { id: 'createToken' });

	const tokenPublicKey = new SolanaPublicKey(mintKeypair.publicKey);
	const associatedToken = getAssociatedTokenAddressSync(
		tokenPublicKey,
		wallet.publicKey,
		false,
		TOKEN_2022_PROGRAM_ID
	);
	const transaction = new Transaction().add(
		createAssociatedTokenAccountInstruction(
			wallet.publicKey,
			associatedToken,
			wallet.publicKey,
			tokenPublicKey,
			TOKEN_2022_PROGRAM_ID
		),
		createMintToInstruction(
			tokenPublicKey,
			associatedToken,
			wallet.publicKey,
			mintAmount * Math.pow(10, 9),
			[],
			TOKEN_2022_PROGRAM_ID
		)
	);

	toast.loading('Please sign the transaction to mint tokens...', { id: 'mintTokens' });
	await wallet.sendTransaction(transaction, connection);
	toast.success('Tokens minted successfully!', { id: 'mintTokens' });

	const signature = base58.deserialize(txid)[0];
	console.log('Transaction signature:', signature);

	console.log('Token Public Key:', tokenPublicKey);

	return { signature, tokenPublicKey };
};
