import * as React from "react";

const Error = (props: React.SVGProps<SVGSVGElement>) => (
  <svg width={90} height={90} fill="none" {...props}>
    <circle opacity={0.15} cx={45} cy={45} r={45} fill="#F5325B" />
    <circle cx={45} cy={45} r={30} fill="#F5325B" />
    <path
      d="M52 39.41 50.59 38 45 43.59 39.41 38 38 39.41 43.59 45 38 50.59 39.41 52 45 46.41 50.59 52 52 50.59 46.41 45 52 39.41Z"
      fill="#fff"
    />
  </svg>
);

export default Error;
