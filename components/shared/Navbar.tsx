'use client';
import Link from 'next/link';
import Wallet from '../icons/Wallet';
import { Button } from '@/components/ui/button';
import { Drawer, DrawerContent, DrawerTrigger } from '@/components/ui/drawer';
import DrawerButton from '../icons/Drawer';

const navLinks = [
	{ name: 'Playground', href: '/playground' },
	{ name: 'Adapter', href: '/adapter' },
	{ name: 'Github', href: 'https://github.com' },
	{ name: 'Twitter', href: 'https://twitter.com' },
];

const Navbar = () => {
	const NavLinks = () => (
		<>
			{navLinks.map((link) => (
				<Link
					key={link.name}
					href={link.href}
					className='group relative overflow-hidden'
				>
					<span className='text-sm font-semibold text-gray-300 transition-colors duration-300 group-hover:text-white'>
						{link.name}
					</span>

					<span className='absolute bottom-0 left-0 w-full h-0.5 bg-green-500 transform transition-all duration-300 scale-x-0 group-hover:scale-x-100'></span>
				</Link>
			))}
		</>
	);

	return (
		<div className='fixed w-full top-0 z-10 p-5 shadow-lg backdrop-blur-sm'>
			<div className='mx-auto flex max-w-6xl items-center justify-between'>
				<Link
					href={'/'}
					className='text-2xl group md:text-3xl font-bold text-white flex items-center [font-family:var(--font-geist-sans)]'
				>
					Wallet Arsenal
					<div className='relative flex overflow-hidden justify-center items-baseline ml-2'>
						<Wallet className='size-7 translate-x-3 transition-all duration-300 ease-in-out group-hover:translate-x-2 fill-green-700/50 -rotate-[110deg] z-0' />
						<Wallet className='size-7 transition-all duration-300 ease-in-out group-hover:scale-110 -rotate-90 z-10 fill-green-700' />
						<Wallet className='size-7 -translate-x-3 transition-all duration-300 ease-in-out group-hover:-translate-x-2 fill-green-700/40 -rotate-[70deg] z-0' />
					</div>
				</Link>
				<div className='hidden md:flex items-center space-x-6'>
					<NavLinks />
				</div>
				<Drawer>
					<DrawerTrigger asChild>
						<Button
							size='icon'
							className='md:hidden bg-transparent'
						>
							<DrawerButton className='size-6' />
							<span className='sr-only'>Open menu</span>
						</Button>
					</DrawerTrigger>
					<DrawerContent className='bg-black border-2 border-zinc-900 '>
						<div className='mx-auto w-full max-w-sm'>
							<nav className='flex flex-col space-y-7 p-4 justify-center items-center'>
								<NavLinks />
							</nav>
						</div>
					</DrawerContent>
				</Drawer>
			</div>
		</div>
	);
};

export default Navbar;
