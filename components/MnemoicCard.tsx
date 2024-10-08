import {
	Accordion,
	AccordionContent,
	AccordionItem,
	AccordionTrigger,
} from '@/components/ui/accordion';
import { Check, Copy, EyeOff } from 'lucide-react';
import { useState } from 'react';

type Props = { mnemonics: string };

const MnemoicCard = (props: Props) => {
	const mnemonicWords = props.mnemonics?.trim().split(' ');
	const [copied, setCopied] = useState(false);

	return (
		<div className='bg-black mt-40 px-4 sm:px-6 md:px-10 p-3 rounded-xl w-full border border-white/10 [-family:var(--font-geist-mono)]'>
			<Accordion
				type='single'
				collapsible
				className='w-full'
			>
				<AccordionItem
					value='seed-phrase'
					className='border-none'
				>
					<AccordionTrigger className='text-left hover:no-underline'>
						<div className='text-xl sm:text-2xl font-bold'>YOUR SEED PHRASE</div>
					</AccordionTrigger>
					<AccordionContent className='flex flex-col items-center justify-center'>
						<div className='grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2 sm:gap-4 p-1 mt-3 w-full group relative'>
							{mnemonicWords.map((word, index) => (
								<div
									key={index}
									className='blur-sm uppercase transition-all duration-500 ease-in-out group-hover:blur-none bg-white/90 p-2 sm:p-3 px-2 sm:px-4 rounded text-sm sm:text-base md:text-lg text-black font-bold'
								>
									<span className='text-black/50'>{(index + 1).toString().padStart(2, '0')} /</span>{' '}
									{word}
								</div>
							))}
							<EyeOff className='absolute top-1/2 right-1/2 opacity-100 translate-x-1/2 -translate-y-1/2 size-6 sm:size-8 md:size-10 stroke-black/50 group-hover:opacity-0 transition-all duration-300 ease-in-out' />
						</div>
						<button
							className='flex w-full sm:w-48 items-center justify-center mt-6 sm:mt-8 gap-2 sm:gap-4 px-4 py-2 rounded
									   transition-all duration-200 ease-in-out
									   hover:text-white/70 active:text-white/20'
							onClick={() => {
								navigator.clipboard.writeText(props.mnemonics);
								setCopied(true);
								setTimeout(() => setCopied(false), 2000);
							}}
						>
							{copied ? <Check className='text-green-500' /> : <Copy />}
							<span className='text-base sm:text-lg font-bold uppercase'>
								{copied ? 'Copied!' : 'Copy Phrase'}
							</span>
						</button>
					</AccordionContent>
				</AccordionItem>
			</Accordion>
		</div>
	);
};

export default MnemoicCard;
