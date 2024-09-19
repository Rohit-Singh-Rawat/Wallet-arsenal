import * as React from 'react';
import { SVGProps } from 'react';
const Tether = (props: SVGProps<SVGSVGElement>) => (
	<svg
		xmlns='http://www.w3.org/2000/svg'
		xmlSpace='preserve'
		width={32}
		height={32}
		{...props}
	>
		<path
			fill='#1ad2a4'
			d='M30.4 14.51c.19.4.1.87-.21 1.17L16.7 28.7c-.39.38-1.01.38-1.4 0L1.81 15.68c-.31-.3-.4-.77-.21-1.17L6.59 4.08c.17-.36.52-.58.92-.58h16.98c.4 0 .75.22.92.58l4.99 10.43z'
		/>
		<path
			fill='#455a64'
			d='M16 29.49c-.38 0-.75-.14-1.05-.43L1.46 16.04c-.46-.45-.59-1.15-.31-1.74L6.14 3.86c.25-.53.78-.86 1.37-.86h16.98c.59 0 1.12.33 1.37.87l4.99 10.43c.28.59.15 1.29-.31 1.75L17.05 29.06c-.3.29-.67.43-1.05.43zM7.51 4a.51.51 0 0 0-.47.29L2.05 14.73c-.09.2-.05.44.11.6l13.49 13.02c.2.19.51.19.7 0l13.49-13.02c.16-.15.2-.4.11-.6L24.96 4.3a.503.503 0 0 0-.47-.3H7.51z'
		/>
		<path
			fill='#fff'
			d='M16 17c-3.53 0-9.5-.53-9.5-2.5 0-1.94 5.77-2.37 7.54-2.45.31-.02.51.2.52.48.01.28-.2.51-.47.52-4.37.21-6.48 1.07-6.59 1.46.15.51 3.2 1.49 8.5 1.49s8.35-.98 8.5-1.51c-.11-.37-2.2-1.22-6.53-1.44a.487.487 0 0 1-.47-.52c.01-.27.22-.48.52-.47 1.75.09 7.48.53 7.48 2.45 0 1.96-5.97 2.49-9.5 2.49zM22.5 9h-13c-.28 0-.5-.22-.5-.5s.22-.5.5-.5h13c.28 0 .5.22.5.5s-.22.5-.5.5z'
		/>
		<path
			fill='#fff'
			d='M16 23.5c-.28 0-.5-.22-.5-.5v-6.5c0-.28.22-.5.5-.5s.5.22.5.5V23c0 .28-.22.5-.5.5zM16 15c-.28 0-.5-.22-.5-.5v-6c0-.28.22-.5.5-.5s.5.22.5.5v6c0 .28-.22.5-.5.5z'
		/>
	</svg>
);
export default Tether;
