import * as React from 'react';
import { SVGProps } from 'react';
const Copy = (props: SVGProps<SVGSVGElement>) => (
	<svg
		xmlns='http://www.w3.org/2000/svg'
		viewBox='0 0 64 64'
    className='size-5  group-active/copy:scale-110 transition-all duration-300'
		{...props}
	>
		<g
			fill='#040606'
			className='color000000 svgShape'
			data-name='Layer 62'
		>
			<path
				d='M17.44 40.06H14a.5.5 0 0 1-.5-.5V14a.51.51 0 0 1 .5-.5h25.56a.5.5 0 0 1 .5.5v3.44a1.5 1.5 0 0 0 3 0V14a3.5 3.5 0 0 0-3.5-3.5H14a3.5 3.5 0 0 0-3.5 3.5v25.56a3.5 3.5 0 0 0 3.5 3.5h3.44a1.5 1.5 0 0 0 0-3Z'
				className='color000000 svgShape group-active/copy:translate-x-2 group-active/copy:translate-y-2 transition-all duration-300 ease-in-out'
			/>
			<rect
				width={32.56}
				height={32.56}
				x={20.94}
				y={20.94}
				className='color000000 svgShape'
				rx={3.5}
			/>
		</g>
	</svg>
);
export default Copy;
