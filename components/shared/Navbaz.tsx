'use client';
import Link from 'next/link';
import { useState } from 'react';

const navLinks = [
	{ name: 'Coin', href: '/coin' },
	{ name: 'Github', href: 'https://github.com' },
	{ name: 'Twitter', href: 'https://twitter.com' }
];

const Navbar = () => {
	const [hovered, setHovered] = useState('');

	return (
		<div className="fixed w-full top-0 z-10  p-4 shadow-lg backdrop-blur-sm">
			<div className="mx-auto flex max-w-6xl items-center justify-between">
				<Link href={'/'} className="text-3xl font-bold text-white transition-all duration-300 hover:text-green-300">
					Wallet Arsenal
				</Link>
				<div className="flex items-center space-x-6">
					{navLinks.map((link) => (
						<Link
							key={link.name}
							href={link.href}
							className="group relative overflow-hidden"
							onMouseEnter={() => setHovered(link.name)}
							onMouseLeave={() => setHovered('')}
						>
							<span className="text-sm font-medium text-gray-300 transition-colors duration-300 group-hover:text-white">
								{link.name}
							</span>
						
							<span className={`absolute bottom-0 left-0 w-full h-0.5 bg-green-500 transform transition-transform duration-300 ${hovered === link.name ? 'scale-x-100' : 'scale-x-0'}`}></span>
						</Link>
					))}
				</div>
			</div>
		</div>
	);
};

export default Navbar;