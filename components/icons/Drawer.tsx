import * as React from 'react';
import { SVGProps } from 'react';
const Drawer = (props: SVGProps<SVGSVGElement>) => (
	<svg
		xmlns='http://www.w3.org/2000/svg'
		data-name='Layer 3'
		viewBox='0 0 24 24'
		{...props}
	>
		<path
			fill='#fff'
			d='M19 20H5a3 3 0 0 1-3-3v-6a1 1 0 0 1 1-1h4.341a3.011 3.011 0 0 1 2.816 1.781 2 2 0 0 0 3.686 0A3.011 3.011 0 0 1 16.659 10H21a1 1 0 0 1 1 1v6a3 3 0 0 1-3 3ZM4 12v5a1 1 0 0 0 1 1h14a1 1 0 0 0 1-1v-5h-3.341a1.036 1.036 0 0 0-.974.561 4 4 0 0 1-7.37 0A1.036 1.036 0 0 0 7.341 12Z'
			className='color000000 svgShape'
		/>
		<path
			fill='#fff'
			d='M21 12a1 1 0 0 1-.9-.553l-2.442-4.894A.993.993 0 0 0 16.764 6H7.236a.993.993 0 0 0-.894.553L3.9 11.447a1 1 0 0 1-1.79-.894l2.448-4.9A2.985 2.985 0 0 1 7.236 4h9.528a2.985 2.985 0 0 1 2.683 1.658l2.448 4.9A1 1 0 0 1 21 12Z'
			className='color000000 svgShape'
		/>
	</svg>
);
export default Drawer;
