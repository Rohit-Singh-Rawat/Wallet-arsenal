import * as React from 'react';
import { SVGProps } from 'react';
const Token = (props: SVGProps<SVGSVGElement>) => (
	<svg
		xmlns='http://www.w3.org/2000/svg'
		width={128}
		height={128}
		viewBox='0 0 128 128'
		fill='none'
		{...props}
	>
		<path
			strokeLinejoin='round'
			strokeWidth={7}
			d='M64 100V73M32.55 46 56 59.794M94.5 47.14 72.267 59.794'
		/>
		<path

			strokeWidth={7}
			d='M52 31.928a24 24 0 0 1 24 0l9.775 5.644a24 24 0 0 1 12 20.784v11.288a24 24 0 0 1-12 20.784L76 96.072a24 24 0 0 1-24 0l-9.775-5.644a24 24 0 0 1-12-20.784V58.356a24 24 0 0 1 12-20.784L52 31.928Z'
		/>
		<circle
			cx={64}
			cy={64}
			r={11}
			strokeWidth={7}
			transform='rotate(180 64 64)'
		/>
	</svg>
);
export default Token;
