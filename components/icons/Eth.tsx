import React from 'react';

interface EthProps extends React.SVGProps<SVGSVGElement> {}

const Eth: React.FC<EthProps> = (props) => {
  return (
    <svg
      xmlns='http://www.w3.org/2000/svg'
      viewBox='0 0 128 128'
      id='ethereum'
      {...props}
    >
      <path d='M28.09 65.65 64 7l35.91 58.65L64 86.57 28.09 65.65z'></path>
      <path d='m64 93.16 34.76-21.58L64 121 28.42 71.58 64 93.16z'></path>
    </svg>
  );
};

export default Eth;
