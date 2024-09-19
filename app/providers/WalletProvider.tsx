'use client';

import {
	ConnectionProvider,
	WalletProvider as SolanaWalletProvider,
} from '@solana/wallet-adapter-react';
import { WalletModalProvider } from '@solana/wallet-adapter-react-ui';

const WalletProvider = ({ children }: { children: React.ReactNode }) => {
	return (
		<ConnectionProvider
			endpoint={'https://solana-devnet.g.alchemy.com/v2/' + process.env.NEXT_PUBLIC_ALCHEMY_API_KEY}
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
