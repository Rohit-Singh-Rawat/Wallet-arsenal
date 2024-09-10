import React from 'react';

interface SolProps extends React.SVGProps<SVGSVGElement> {}

const Sol: React.FC<SolProps> = (props) => {
  return (
    <svg
      xmlns='http://www.w3.org/2000/svg'
      viewBox='0 0 128 128'
      id='sol'
      {...props}
    >
      <path d='M93.94 42.63H13.78l20.28-20.22h80.16L93.94 42.63zM93.94 105.59H13.78l20.28-20.21h80.16M34.06 74.11h80.16L93.94 53.89H13.78'></path>
    </svg>
  );
};

export default Sol;
