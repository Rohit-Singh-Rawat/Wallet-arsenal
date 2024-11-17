import Link from 'next/link';

const socialLinks = [
	{
		name: 'Github',
		href: 'https://github.com/Rohit-Singh-Rawat/Wallet-arsenal',
		target: '_blank',
		rel: 'noopener noreferrer',
	},
	{
		name: 'X',
		href: 'https://x.com/Spacing_Whale',
		target: '_blank',
		rel: 'noopener noreferrer',
	},
];

const Bottombar = () => {
	return (
		<footer className='w-full p-4 h-12 bg-black/20 backdrop-blur-sm border-t border-zinc-900'>
			<div className='max-w-6xl mx-auto flex flex-row justify-between items-center'>
				<div className='flex justify-center items-center gap-6'>
					{socialLinks.map((link) => (
						<Link
							key={link.name}
							href={link.href}
							target={link.target}
							rel={link.rel}
							className='text-sm text-gray-400 hover:text-white transition-colors'
						>
							{link.name}
						</Link>
					))}
				</div>
				<p className='text-sm text-gray-400 absolute left-1/2 -translate-x-1/2'>
					Made with ❤️ by{' '}
					<Link
						href='https://rohitsinghrawat.tech'
						target='_blank'
						rel='noopener noreferrer'
						className='hover:text-white transition-colors'
					>
						Rohit
					</Link>
				</p>
				<p className='text-sm text-gray-400'>© {new Date().getFullYear()}</p>
			</div>
		</footer>
	);
};

export default Bottombar;
