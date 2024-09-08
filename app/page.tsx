import Wallet from '@/components/icons/Wallet';
const page = () => {
	return (
		<main className='  min-h-screen container  flex  items-center flex-col gap-10'>
			<div className='text-5xl w-2/3 text-center font-bold pt-[30vh]'>
				Craft{' '}
				<span className='bg-gradient-to-r bg-clip-text text-transparent from-[#14F095] to-[#9847FE]'>
					wallets
				</span>
				, master blockchain transactions.
			</div>
			<div className='gap-5 w-full flex flex-col items-center 	justify-center  '>
				<input
					type='text'
					className='p-2 w-1/3 border rounded-3xl bg-transparent outline-none border-green-400 px-5 placeholder:text-white/20 placeholder:text-center'
					placeholder='Enter your secret phrase (or leave blank to generate)'
				/>
				<button className='rounded-3xl w-44 p-[10px] px-5 bg-green-400 text-black font-bold border border-green-600 flex items-center justify-center gap-2 group transition-all duration-300 overflow-hidden'>
					<span className='transition-opacity duration-300 ease-in-out opacity-100 group-hover:opacity-0 delay-300 group-hover:delay-0'>
						Create Wallet
					</span>
					<Wallet
						className='transition-transform group-hover:-rotate-90 duration-500 group-hover:delay-300 ease-in-out group-hover:scale-[3.2] group-hover:-translate-x-14 group-hover:translate-y-1 size-[18px] fill-black'
						
					/>
				</button>
			</div>
		</main>
	);
};
export default page;
