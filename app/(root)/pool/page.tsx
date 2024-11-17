'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { Control, useForm } from 'react-hook-form';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import {
	Form,
	FormControl,
	FormDescription,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Loader2, WalletCards } from 'lucide-react';
import TokenSelect from '@/components/poolComponents/TokenSelect';
import { useConnection, useWallet } from '@solana/wallet-adapter-react';
import { Metaplex } from '@metaplex-foundation/js';
import { WalletMultiButton } from '@solana/wallet-adapter-react-ui';
import { cn } from '@/lib/utils';
import { createAmmPool } from '@/lib/createPool';

const formSchema = z.object({
	baseToken: z.string().min(1, 'Base token address is required'),
	baseAmount: z.number().gt(0, 'Amount must be greater than 0'),
	quoteToken: z.string().min(1, 'Quote token address is required'),
	quoteAmount: z.number().gt(0, 'Amount must be positive'),
	initialPrice: z.number().gt(0, 'Price must be positive'),
});
interface CustomFormFieldProps {
	control: Control<z.infer<typeof formSchema>>;
	name: keyof z.infer<typeof formSchema>;
	label: string;
	placeholder: string;
	type?: 'text' | 'number';
	description?: string;
	className?: string;
}

const CustomFormField: React.FC<CustomFormFieldProps> = ({
	control,
	name,
	label,
	placeholder,
	type = 'text',
	description,
	className,
}) => (
	<FormField
		control={control}
		name={name}
		render={({ field }) => (
			<FormItem>
				<FormLabel>{label}</FormLabel>
				<FormControl>
					<Input
						placeholder={placeholder}
						type={type}
						className={cn('bg-[#0b0c0b] border-2 rounded-lg border-[#1E1F21]', className)}
						{...field}
						onChange={
							type === 'number' ? (e) => field.onChange(Number(e.target.value)) : field.onChange
						}
					/>
				</FormControl>
				{description && <FormDescription>{description}</FormDescription>}
				<FormMessage />
			</FormItem>
		)}
	/>
);

const Page = () => {
	const wallet = useWallet();
	const { connection } = useConnection();
	const metaplex = Metaplex.make(connection);

	const form = useForm<z.infer<typeof formSchema>>({
		resolver: zodResolver(formSchema),
		defaultValues: {
			baseToken: '',
			baseAmount: 0,
			quoteToken: '',
			quoteAmount: 0,
			initialPrice: 0,
		},
	});

	const onSubmit = async (data: z.infer<typeof formSchema>) => {
		try {
			console.log(data);
			// const rep = createAmmPool()
		} catch (error) {
			console.error('Error creating pool:', error);
		}
	};

	return (
		<div className='w-full max-w-2xl mx-auto'>
			<div className='bg-yellow-500/10 border border-yellow-500/20 rounded-lg mt-20 p-4 my-6 text-yellow-500 text-center'>
				⚠️ This pool creation feature is currently under development
			</div>
			<h1 className='text-4xl font-bold mb-5 text-center [font-family:var(--font-geist-mono)]'>
				Create Liquidity Pool
			</h1>
			<div className='flex justify-end '>
				<WalletMultiButton
					style={{
						background: 'transparent',
					}}
				>
					{!wallet.publicKey ? <WalletCards /> : <div></div>}
				</WalletMultiButton>
			</div>
			<Form {...form}>
				<form
					onSubmit={form.handleSubmit(onSubmit)}
					className='border-2 p-10 rounded-2xl mb-10 border-green-950/50 bg-gradient-to-tr from-[#000000]/20 to-[#122821]/20 [font-family:var(--font-geist-mono)]'
				>
					<div className='grid grid-cols-2 gap-5 gap-x-14'>
						<TokenSelect
							control={form.control}
							label='Base Token'
							baseToken={form.watch('baseToken')}
							quoteToken={form.watch('quoteToken')}
							wallet={wallet}
							connection={connection}
							name='baseToken'
							metaplex={metaplex}
						/>

						<CustomFormField
							control={form.control}
							name='baseAmount'
							label='Base Token Amount'
							placeholder='Enter base amount'
							type='number'
							className='h-14'
						/>

						<TokenSelect
							control={form.control}
							label='Quote Token'
							baseToken={form.watch('baseToken')}
							quoteToken={form.watch('quoteToken')}
							wallet={wallet}
							connection={connection}
							name='quoteToken'
							metaplex={metaplex}
						/>

						<CustomFormField
							control={form.control}
							name='quoteAmount'
							label='Quote Token Amount'
							placeholder='Enter quote amount'
							type='number'
							className='h-14'
						/>
					</div>

					<CustomFormField
						control={form.control}
						name='initialPrice'
						label='Initial Price'
						placeholder='Enter initial price'
						type='number'
						description='Set the initial price ratio (Quote/Base)'
						className='h-14'
					/>

					<Button
						type='submit'
						variant='secondary'
						className='w-full rounded-lg font-bold mt-5'
						disabled={form.formState.isSubmitting}
					>
						{form.formState.isSubmitting ? (
							<>
								<Loader2 className='mr-2 h-4 w-4 animate-spin' />
								Creating Pool...
							</>
						) : (
							'Create Pool'
						)}
					</Button>
				</form>
			</Form>
		</div>
	);
};

export default Page;
