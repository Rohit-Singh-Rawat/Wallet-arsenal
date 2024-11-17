'use client';

import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { useRPCStore } from '@/app/store/RPCStore';

export default function RPCSwitch() {
	const { cluster, ChangeCluster } = useRPCStore();

	return (
		<div className='inline-flex items-center gap-2 min-w-24 '>
			<Switch
				id='rpc-switch'
				checked={cluster === 'mainnet'}
				onCheckedChange={ChangeCluster}
				aria-label='Toggle RPC network'
				className="data-[state=checked]:bg-green-600 data-[state=unchecked]:bg-neutral-800 [&_span]:transition-all [&_span]:data-[state=unchecked]:size-4 [&_span]:data-[state=unchecked]:translate-x-0.5 [&_span]:data-[state=unchecked]:bg-white [&_span]:data-[state=checked]:bg-white [&_span]:data-[state=unchecked]:shadow-none rtl:[&_span]:data-[state=unchecked]:-translate-x-0.5"
			/>
			<Label htmlFor='rpc-switch'>
				<span className='sr-only'>Toggle RPC network</span>
				<span className='text-sm'>
					{cluster === 'mainnet' ? 'Mainnet' : 'Devnet'}
				</span>
			</Label>
		</div>
	);
}
