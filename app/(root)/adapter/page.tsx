'use client';
import Wallet from '@/components/AdapterComponent/Wallet';
import { WalletMultiButton } from '@solana/wallet-adapter-react-ui';

const page = () => {
	return (
		<>
			<div className='p-10	mt-20'>
				<WalletMultiButton
					style={{ background: '#141416', border: 'none', borderRadius: '10px', padding: '0 	30px' }}
				/>
			</div>
				<div className='mb-20'>
					<Wallet />
				</div>
				
		</>
	);
};
export default page;
