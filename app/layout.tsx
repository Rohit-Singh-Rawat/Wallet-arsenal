import type { Metadata } from 'next';
import localFont from 'next/font/local';
import './globals.css';
import Navbar from '@/components/shared/Navbar';
import { Toaster } from 'sonner';
import ReactQueryProvider from './providers/QueryClientProvider';
import WalletProvider from './providers/WalletProvider';
import '@solana/wallet-adapter-react-ui/styles.css';
const geistSans = localFont({
	src: './fonts/GeistVF.woff',
	variable: '--font-geist-sans',
	weight: '100 900',
});
const geistMono = localFont({
	src: './fonts/GeistMonoVF.woff',
	variable: '--font-geist-mono',
	weight: '100 900',
});

export const metadata: Metadata = {
	title: 'Wallet Arsenal',
	description: 'Build your crypto wallet arsenal and conquer blockchain transactions with ease.',
	keywords: ['wallet', 'blockchain', 'cryptocurrency', 'Ethereum', 'Solana', 'arsenal'],
	authors: [{ name: 'Rohit Singh Rawat ' }],
	openGraph: {
		title: 'Wallet Arsenal',
		description: 'Build your crypto wallet arsenal and conquer blockchain transactions with ease.',
		images: ['/images/card.png'],
	},
	twitter: {
		card: 'summary_large_image',
		title: 'Wallet Arsenal',
		description: 'Build your crypto wallet arsenal and conquer blockchain transactions with ease.',
		images: ['/images/card.png'],
	},
};

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<html lang='en'>
			{' '}
			<WalletProvider>
				<body
					className={`${geistSans.variable} ${geistMono.variable} antialiased flex  items-center bg-mesh flex-col min-h-screen`}
				>
					<ReactQueryProvider>
						<Navbar />{' '}
						<main className='max-w-7xl lg:px-16 px-2  container  flex  items-center flex-col justify-center min-h-screen'>
							{children}
						</main>
						<Toaster theme='dark' />
					</ReactQueryProvider>
				</body>
			</WalletProvider>
		</html>
	);
}
