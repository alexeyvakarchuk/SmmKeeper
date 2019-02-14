import React from "react";

const Icon = () => (
  <svg viewBox="0 0 120 30" xmlns="http://www.w3.org/2000/svg" fill="#fff">
    <circle cx="15" cy="15" r="12">
      <animate
        attributeName="r"
        from="12"
        to="12"
        begin="0s"
        dur="1s"
        values="12;7;12"
        calcMode="linear"
        repeatCount="indefinite"
      />
      <animate
        attributeName="fill-opacity"
        from=".8"
        to=".8"
        begin="0s"
        dur="1s"
        values=".8;.5;.8"
        calcMode="linear"
        repeatCount="indefinite"
      />
    </circle>
    <circle cx="60" cy="15" r="9" fillOpacity=".3">
      <animate
        attributeName="r"
        from="9"
        to="9"
        begin="0s"
        dur="1s"
        values="9;15;9"
        calcMode="linear"
        repeatCount="indefinite"
      />
      <animate
        attributeName="fill-opacity"
        from=".5"
        to=".5"
        begin="0s"
        dur="1s"
        values=".5;1;.5"
        calcMode="linear"
        repeatCount="indefinite"
      />
    </circle>
    <circle cx="105" cy="15" r="12">
      <animate
        attributeName="r"
        from="12"
        to="12"
        begin="0s"
        dur="1s"
        values="12;7;12"
        calcMode="linear"
        repeatCount="indefinite"
      />
      <animate
        attributeName="fill-opacity"
        from=".8"
        to=".8"
        begin="0s"
        dur="1s"
        values=".8;.5;.8"
        calcMode="linear"
        repeatCount="indefinite"
      />
    </circle>
  </svg>
);

export default Icon;
