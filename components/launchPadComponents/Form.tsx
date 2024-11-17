'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { Control, useForm } from 'react-hook-form';
import { z } from 'zod';

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
import { WalletMultiButton } from '@solana/wallet-adapter-react-ui';
import { Loader2, WalletCards } from 'lucide-react';
import { useConnection, useWallet } from '@solana/wallet-adapter-react';
import { toast } from 'sonner';
import { createToken } from '@/lib/createToken';

const formSchema = z.object({
	name: z.string().min(2, {
		message: 'Name must be at least 2 characters.',
	}),
	symbol: z.string().min(1, {
		message: 'Symbol is required.',
	}),
	initialSupply: z.number().positive({
		message: 'Initial supply must be a positive number.',
	}),
	imageUrl: z.string().url({
		message: 'Please enter a valid URL for the image.',
	}),
});

interface CustomFormFieldProps {
	control: Control<{
		symbol: string;
		name: string;
		initialSupply: number;
		imageUrl: string;
	}>;
	name: 'symbol' | 'name' | 'initialSupply' | 'imageUrl';
	label: string;
	placeholder: string;
	type?: 'text' | 'number';
	description: string;
}

const CustomFormField: React.FC<CustomFormFieldProps> = ({
	control,
	name,
	label,
	placeholder,
	type = 'text',
	description,
}) => (
	<FormField
		control={control}
		name={name}
		render={({ field }) => (
			<FormItem>
				<FormLabel className='text-[#5F5F5F] '>{label}</FormLabel>
				<FormControl>
					<Input
						placeholder={placeholder}
						type={type}
						className='bg-[#0b0c0b] border-2 rounded-lg border-[#1E1F21] focus-within:border-[#6C6D6D] transition-colors duration-200 ease-out focus-within:bg-[#131313]'
						{...field}
						onChange={
							type === 'number' ? (e) => field.onChange(Number(e.target.value)) : field.onChange
						}
					/>
				</FormControl>
				<FormDescription className='text-[#868686]'>{description}</FormDescription>
				<FormMessage />
			</FormItem>
		)}
	/>
);

export function LaunchPadForm() {
	const form = useForm<z.infer<typeof formSchema>>({
		resolver: zodResolver(formSchema),
		defaultValues: {
			name: '',
			symbol: '',
			initialSupply: 0,
			imageUrl: '',
		},
	});
	const { connection } = useConnection();

	const wallet = useWallet();

	const onSubmit = async (data: z.infer<typeof formSchema>) => {
		if (!wallet.publicKey) {
			toast.error('Please connect your wallet to continue');
			return;
		}
		try {
			const { signature, tokenPublicKey } = await createToken(
				connection,
				wallet,
				data.name,
				data.symbol,
				data.imageUrl,
				data.initialSupply
			);
			const publicUrl = `https://explorer.solana.com/tx/${signature}`;
			navigator.clipboard.writeText(tokenPublicKey!.toString());
			toast.success(`Token created successfully! Signature: ${signature}`, { id: 'createToken' });
			toast.success(`Transaction URL: ${publicUrl}`, { id: 'createToken' });
			toast.success(`Token Public Key copied to clipboard!`, { id: 'copyTokenId' });
		} catch (error) {
			console.error('Error creating token:', error);
			toast.error('Failed to create token. Please try again.', { id: 'createToken' });
			toast.dismiss('uploadMetadata');
			toast.dismiss('mintTokens');
		}
	};

	return (
		<Form {...form}>
			<form
				onSubmit={form.handleSubmit(onSubmit)}
				className=' border-2 p-10 rounded-2xl border-[#1E1F21]  flex-col flex'
			>
				<div className='flex justify-end'>
					<WalletMultiButton
						style={{
							background: 'transparent',
						}}
					>
						{!wallet.publicKey ? <WalletCards /> : <div></div>}
					</WalletMultiButton>
				</div>
				<div className='grid grid-cols-2 gap-5 gap-x-14'>
					<CustomFormField
						control={form.control}
						name='name'
						label='Name'
						placeholder='Token Name'
						description='Enter the name of your token.'
					/>
					<CustomFormField
						control={form.control}
						name='symbol'
						label='Symbol'
						placeholder='TKN'
						description='Enter the symbol for your token.'
					/>
					<CustomFormField
						control={form.control}
						name='initialSupply'
						label='Initial Supply'
						placeholder='1000000'
						type='number'
						description='Enter the initial supply of your token.'
					/>
					<CustomFormField
						control={form.control}
						name='imageUrl'
						label='Image URL'
						placeholder='https://example.com/token-image.png'
						description="Enter the URL for your token's image."
					/>
				</div>
				<Button
					type='submit'
					variant={'secondary'}
					className='rounded-lg font-bold flex-1 mt-8'
					disabled={form.formState.isSubmitting}
				>
					{form.formState.isSubmitting ? (
						<>
							<Loader2 className='mr-2 h-4 w-4 animate-spin' />
							Creating...
						</>
					) : (
						'Submit'
					)}
				</Button>
			</form>
		</Form>
	);
}
