import React from "react";

const Icon = props => (
  <svg viewBox="0 0 15 18" xmlns="http://www.w3.org/2000/svg">
    <g fill="none" fillRule="evenodd">
      <path
        d="M7.5 17.308a2.153 2.153 0 0 0 2.142-2.164H5.358c0 1.195.96 2.164 2.142 2.164zm7.212-5.061c-.647-.702-1.858-1.758-1.858-5.216 0-2.626-1.824-4.729-4.283-5.245v-.704C8.57.484 8.09 0 7.5 0S6.43.484 6.43 1.082v.704c-2.46.516-4.284 2.619-4.284 5.245 0 3.458-1.21 4.514-1.858 5.216-.2.218-.29.479-.288.734.004.554.435 1.082 1.075 1.082h12.85c.64 0 1.072-.528 1.075-1.082a1.061 1.061 0 0 0-.288-.734z"
        fill="#9CC5FF"
      />
      <circle fill="#F85D70" cx="11.5" cy="4.5" r="3.5" />
      <text fontFamily=".AppleSystemUIFont" fontSize="5" fill="#FFF">
        <tspan x="10" y="6">
          {props.counter}
        </tspan>
      </text>
    </g>
  </svg>
);

export default Icon;
