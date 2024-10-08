'use client';
import { ArrowRight } from 'lucide-react';
import Link from 'next/link';
import { motion } from 'framer-motion';

import Bitcoin from '@/components/icons/Bitcoin';
import Metamask from '@/components/icons/Metamask';
import Tether from '@/components/icons/Tether';
import Solana from '@/components/icons/Solana';
import Ethereum from '@/components/icons/Ethereum';

const icons = [Bitcoin, Ethereum, Metamask, Tether, Solana];
const sizes = ['size-8	', 'size-12', 'size-16'];
const positions = [
	{ top: '45%', left: '35%' },
	{ top: '25%', left: '60%' },
	{ top: '70%', left: '20%' },
	{ top: '15%', left: '80%' },
	{ top: '55%', left: '75%' },
	{ top: '85%', left: '45%' },
	{ top: '35%', left: '10%' },
	{ top: '65%', left: '90%' },
	{ top: '80%', left: '65%' },
	{ top: '10%', left: '30%' },
];

const CryptoSymbol = ({ Icon, size, position, rotate, speed }: {
  Icon: React.ComponentType<React.SVGProps<SVGSVGElement>>;
  size: string;
  position: { top: string; left: string };
  rotate: number;
  speed: number;
}) => (
	<motion.div
		className='absolute opacity-20'
		initial={{ rotate: 0, scale: 1 }}
		animate={{
			rotate,
			scale: [1, 1.2, 1],
			opacity: [0.2, 0.5, 0.2],
		}}
		transition={{
			duration: speed,
			repeat: Infinity,
		}}
		style={position}
	>
		<Icon className={`${size} text-gray-500`} />
	</motion.div>
);

const CryptoSymbols = () => (
	<div className='absolute -z-10 w-full h-full'>
		{icons.flatMap((Icon, index) => [
			<CryptoSymbol
				key={`${index}-1`}
				Icon={Icon}
				size={sizes[index % 3]}
				position={positions[index * 2]}
				rotate={360}
				speed={(index + 1) * 50}
			/>,
			<CryptoSymbol
				key={`${index}-2`}
				Icon={Icon}
				size={sizes[index % 3]}
				position={positions[index * 2 + 1]}
				rotate={-360}
				speed={(index + 1.5) * 50}
			/>,
		])}
	</div>
);

const Page = () => (
	<>
		<CryptoSymbols />
		<div className='relative w-full h-full flex flex-col items-center'>
			<h1 className='text-3xl md:text-5xl xl:w-2/3 w-full text-center font-light'>
				Craft{' '}
				<span className='bg-gradient-to-r bg-clip-text text-transparent from-[#14F095] to-[#9847FE]'>
					wallets
				</span>
				, master blockchain transactions.
			</h1>
			<div className='flex justify-center mt-8 space-x-4'>
				<Link
					href='https://github.com/Rohit-Singh-Rawat/Wallet-arsenal'
					target='_blank'
					rel='noopener noreferrer'
					className='bg-[#141416] hover:bg-[#222226] text-white font-medium py-2 px-6 rounded-full transition duration-300 flex items-center'
				>
					Star on{' '}
					<svg
						className='size-4 ml-2'
						fill='currentColor'
						viewBox='0 0 24 24'
						xmlns='http://www.w3.org/2000/svg'
					>
						<path d='M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12' />
					</svg>
				</Link>
				<Link href='/playground'>
					<button className='relative group inline-flex h-10 overflow-hidden rounded-full p-[2px] focus:outline-none focus:ring-2 focus:ring-slate-400 focus:ring-offset-2 focus:ring-offset-slate-50'>
						<span className='absolute inset-[-1000%] animate-[spin_2s_linear_infinite] bg-[conic-gradient(from_90deg_at_50%_50%,#2D2A4B_0%,#52432C_58%,#2D2A4B_100%)]' />
						<span className='inline-flex h-full w-full cursor-pointer items-center justify-center rounded-full bg-black/90 px-5 py-1 text-sm font-medium text-white backdrop-blur-3xl'>
							Get started
							<ArrowRight className='size-4 ml-2 group-hover:-rotate-45 transition-all duration-300 ease-out' />
						</span>
					</button>
				</Link>
			</div>
		</div>
	</>
);

export default Page;
