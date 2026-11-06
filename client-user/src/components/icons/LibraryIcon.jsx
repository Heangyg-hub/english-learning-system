export default function LibraryIcon({
  height = '1em',
  width,
  size,
  className = '',
  style = {},
  ...props
}) {
  const finalHeight = size || height;
  const finalWidth = size || width || finalHeight;

  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      width={finalWidth}
      height={finalHeight}
      className={`icon-library-liquid ${className}`.trim()}
      style={{
        display: 'inline-block',
        verticalAlign: 'middle',
        flexShrink: 0,
        ...style,
      }}
      aria-hidden="true"
      {...props}
    >
      <g fill="none">
        <defs>
          <linearGradient
            id="SVGLT4mRcgv"
            x1="3"
            x2="21"
            y1="3"
            y2="21"
            gradientUnits="userSpaceOnUse"
          >
            <stop offset="0" stopColor="#4a9dff" stopOpacity=".3" />
            <stop offset=".6" stopColor="#4a9dff" stopOpacity=".52" />
            <stop offset="1" stopColor="#4a9dff" stopOpacity=".78" />
          </linearGradient>
          <linearGradient
            id="SVGPECLIccg"
            x1="3"
            x2="21"
            y1="3"
            y2="21"
            gradientUnits="userSpaceOnUse"
          >
            <stop offset="0" stopColor="#a77bff" stopOpacity=".4" />
            <stop offset="1" stopColor="#a77bff" stopOpacity=".85" />
          </linearGradient>
          <linearGradient
            id="SVGFfSZOe9a"
            x1="3"
            x2="21"
            y1="3"
            y2="21"
            gradientUnits="userSpaceOnUse"
          >
            <stop offset="0" stopColor="#1c3f9e" stopOpacity=".5" />
            <stop offset="1" stopColor="#1c3f9e" stopOpacity=".95" />
          </linearGradient>
          <linearGradient
            id="SVGwsMb5crH"
            x1="3"
            x2="21"
            y1="3"
            y2="21"
            gradientUnits="userSpaceOnUse"
          >
            <stop offset="0" stopColor="#ff7ec1" stopOpacity=".4" />
            <stop offset="1" stopColor="#ff7ec1" stopOpacity=".8" />
          </linearGradient>
          <linearGradient
            id="SVGl6ASibjk"
            x1="3"
            x2="9"
            y1="10"
            y2="23"
            gradientUnits="userSpaceOnUse"
          >
            <stop offset="0" stopColor="#0c1a3a" stopOpacity=".1" />
            <stop offset="1" stopColor="#ff7ec1" stopOpacity=".32" />
          </linearGradient>
          <radialGradient
            id="SVGAzt8BeTl"
            cx="9"
            cy="8"
            r="10"
            gradientUnits="userSpaceOnUse"
          >
            <stop offset="0" stopColor="#fff" stopOpacity=".5" />
            <stop offset="1" stopColor="#fff" stopOpacity="0" />
          </radialGradient>
        </defs>
        <path
          fill="url(#SVGl6ASibjk)"
          d="M2.4 22q0-.8.8-.8h18q.8 0 .8.8t-.8.8h-18q-.8 0-.8-.8"
          className="wm-shadow"
        />
        <path
          fill="url(#SVGl6ASibjk)"
          d="M2.6 7.1q0-.9.9-.9h2.2q.9 0 .9.9v13.2q0 .9-.9.9H3.5q-.9 0-.9-.9Z"
          className="wm-shadow"
        />
        <path
          fill="url(#SVGl6ASibjk)"
          d="M7.5 5.7q0-.9.9-.9h1.2q.9 0 .9.9v14.6q0 .9-.9.9H8.4q-.9 0-.9-.9Z"
          className="wm-shadow"
        />
        <path
          fill="url(#SVGl6ASibjk)"
          d="M11.4 7.9q0-.9.9-.9h2.6q.9 0 .9.9v12.4q0 .9-.9.9h-2.6q-.9 0-.9-.9Z"
          className="wm-shadow"
        />
        <path
          fill="url(#SVGl6ASibjk)"
          d="M15.77 9.46q-.21-.87.66-1.09l1.94-.49q.87-.21 1.09.66l2.71 10.87q.22.87-.66 1.09l-1.94.48q-.87.22-1.09-.65Z"
          className="wm-shadow"
        />
        <rect
          width="20.4"
          height="1.8"
          x="1.8"
          y="20.4"
          fill="url(#SVGLT4mRcgv)"
          stroke="#000"
          strokeOpacity=".3"
          strokeWidth=".22"
          className="wm-k"
          rx=".9"
        />
        <rect
          width="20.4"
          height="1.8"
          x="1.8"
          y="20.4"
          stroke="url(#SVGFfSZOe9a)"
          strokeWidth=".5"
          className="wm-k"
          rx=".9"
        />
        <rect
          width="17"
          height=".5"
          x="3"
          y="20.8"
          fill="#fff"
          fillOpacity=".5"
          className="wm-shine"
          rx=".25"
        />
        <path
          fill="url(#SVGLT4mRcgv)"
          stroke="#000"
          strokeOpacity=".3"
          strokeWidth=".22"
          d="M2.2 6.3q0-.9.9-.9h2.2q.9 0 .9.9v13.2q0 .9-.9.9H3.1q-.9 0-.9-.9Z"
          className="wm-k"
        />
        <path
          stroke="url(#SVGFfSZOe9a)"
          strokeLinejoin="round"
          strokeWidth=".5"
          d="M2.2 6.3q0-.9.9-.9h2.2q.9 0 .9.9v13.2q0 .9-.9.9H3.1q-.9 0-.9-.9Z"
          className="wm-k"
        />
        <path
          fill="url(#SVGAzt8BeTl)"
          d="M2.2 6.3q0-.9.9-.9h2.2q.9 0 .9.9v13.2q0 .9-.9.9H3.1q-.9 0-.9-.9Z"
          className="wm-shine"
        />
        <rect
          width=".7"
          height="13"
          x="2.9"
          y="6.4"
          fill="#fff"
          fillOpacity=".5"
          className="wm-shine"
          rx=".35"
        />
        <path
          fill="url(#SVGwsMb5crH)"
          stroke="#000"
          strokeOpacity=".3"
          strokeWidth=".22"
          d="M7.1 4.9q0-.9.9-.9h1.2q.9 0 .9.9v14.6q0 .9-.9.9H8q-.9 0-.9-.9Z"
          className="wm-k"
        />
        <path
          stroke="url(#SVGFfSZOe9a)"
          strokeLinejoin="round"
          strokeWidth=".5"
          d="M7.1 4.9q0-.9.9-.9h1.2q.9 0 .9.9v14.6q0 .9-.9.9H8q-.9 0-.9-.9Z"
          className="wm-k"
        />
        <path
          fill="url(#SVGAzt8BeTl)"
          d="M7.1 4.9q0-.9.9-.9h1.2q.9 0 .9.9v14.6q0 .9-.9.9H8q-.9 0-.9-.9Z"
          className="wm-shine"
        />
        <rect
          width=".7"
          height="14.4"
          x="7.8"
          y="5"
          fill="#fff"
          fillOpacity=".5"
          className="wm-shine"
          rx=".35"
        />
        <path
          fill="url(#SVGLT4mRcgv)"
          stroke="#000"
          strokeOpacity=".3"
          strokeWidth=".22"
          d="M11 7.1q0-.9.9-.9h2.6q.9 0 .9.9v12.4q0 .9-.9.9h-2.6q-.9 0-.9-.9Z"
          className="wm-k"
        />
        <path
          stroke="url(#SVGFfSZOe9a)"
          strokeLinejoin="round"
          strokeWidth=".5"
          d="M11 7.1q0-.9.9-.9h2.6q.9 0 .9.9v12.4q0 .9-.9.9h-2.6q-.9 0-.9-.9Z"
          className="wm-k"
        />
        <path
          fill="url(#SVGAzt8BeTl)"
          d="M11 7.1q0-.9.9-.9h2.6q.9 0 .9.9v12.4q0 .9-.9.9h-2.6q-.9 0-.9-.9Z"
          className="wm-shine"
        />
        <rect
          width=".7"
          height="12.2"
          x="11.7"
          y="7.2"
          fill="#fff"
          fillOpacity=".5"
          className="wm-shine"
          rx=".35"
        />
        <rect
          width="3"
          height=".9"
          x="2.7"
          y="7"
          fill="#1c3f9e"
          fillOpacity=".75"
          className="wm-deco"
          rx=".3"
        />
        <rect
          width="3"
          height=".9"
          x="2.7"
          y="8.6"
          fill="#1c3f9e"
          fillOpacity=".75"
          className="wm-deco"
          rx=".3"
        />
        <rect
          width="3"
          height=".9"
          x="2.7"
          y="17.4"
          fill="#1c3f9e"
          fillOpacity=".75"
          className="wm-deco"
          rx=".3"
        />
        <rect
          width="2"
          height=".9"
          x="7.6"
          y="5.6"
          fill="#1c3f9e"
          fillOpacity=".75"
          className="wm-deco"
          rx=".3"
        />
        <rect
          width="2"
          height=".9"
          x="7.6"
          y="7.2"
          fill="#1c3f9e"
          fillOpacity=".75"
          className="wm-deco"
          rx=".3"
        />
        <rect
          width="3.4"
          height=".9"
          x="11.5"
          y="7.6"
          fill="#1c3f9e"
          fillOpacity=".75"
          className="wm-deco"
          rx=".3"
        />
        <rect
          width="3.4"
          height=".9"
          x="11.5"
          y="17.8"
          fill="#1c3f9e"
          fillOpacity=".75"
          className="wm-deco"
          rx=".3"
        />
        <rect
          width="2.8"
          height="3"
          x="11.8"
          y="10.2"
          fill="#b9e6ff"
          fillOpacity=".9"
          stroke="#1c3f9e"
          strokeOpacity=".55"
          strokeWidth=".3"
          className="wm-shine"
          rx=".5"
        />
        <path
          fill="url(#SVGPECLIccg)"
          stroke="#000"
          strokeOpacity=".3"
          strokeWidth=".22"
          d="M15.37 8.66q-.21-.87.66-1.09l1.94-.49q.87-.21 1.09.66l2.71 10.87q.22.87-.66 1.09l-1.94.48q-.87.22-1.09-.65Z"
          className="wm-a"
        />
        <path
          stroke="url(#SVGFfSZOe9a)"
          strokeLinejoin="round"
          strokeWidth=".5"
          d="M15.37 8.66q-.21-.87.66-1.09l1.94-.49q.87-.21 1.09.66l2.71 10.87q.22.87-.66 1.09l-1.94.48q-.87.22-1.09-.65Z"
          className="wm-a"
        />
        <path
          fill="url(#SVGAzt8BeTl)"
          d="M15.37 8.66q-.21-.87.66-1.09l1.94-.49q.87-.21 1.09.66l2.71 10.87q.22.87-.66 1.09l-1.94.48q-.87.22-1.09-.65Z"
          className="wm-shine"
        />
        <path
          fill="#1c3f9e"
          fillOpacity=".7"
          d="m16.08 9.41l2.71-.68l.22.88l-2.72.67Zm.48 1.94l2.72-.68l.21.88l-2.71.68Zm1.6 6.41l2.71-.68l.22.87l-2.72.68Z"
          className="wm-a"
        />
      </g>
    </svg>
  );
}

