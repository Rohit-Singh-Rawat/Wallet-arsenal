'use client';

import {
	ConnectionProvider,
	WalletProvider as SolanaWalletProvider,
} from '@solana/wallet-adapter-react';
import { WalletModalProvider } from '@solana/wallet-adapter-react-ui';
import { useRPCStore } from '../store/RPCStore';

const WalletProvider = ({ children }: { children: React.ReactNode }) => {
	const { cluster } = useRPCStore();
	return (
		<ConnectionProvider
			endpoint={
				cluster === 'mainnet'
					? 'https://solana-mainnet.g.alchemy.com/v2/' + process.env.NEXT_PUBLIC_ALCHEMY_API_KEY
					: cluster === 'devnet'
					? 'https://solana-devnet.g.alchemy.com/v2/' + process.env.NEXT_PUBLIC_ALCHEMY_API_KEY
					: 'https://api.testnet.solana.com'
			}
		>
			<SolanaWalletProvider
				wallets={[]}
				autoConnect
			>
				<WalletModalProvider>{children}</WalletModalProvider>
			</SolanaWalletProvider>
		</ConnectionProvider>
	);
};

export default WalletProvider;
