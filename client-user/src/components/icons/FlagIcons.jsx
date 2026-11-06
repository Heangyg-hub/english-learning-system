export function CambodiaFlag({ size = 44, className = '', style = {} }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 512 512"
      width={size}
      height={size}
      className={className}
      style={{
        display: 'inline-block',
        verticalAlign: 'middle',
        borderRadius: '50%',
        flexShrink: 0,
        boxShadow: '0 2px 6px rgba(0,0,0,0.12)',
        ...style,
      }}
      aria-label="Cambodia Flag"
    >
      <defs>
        <clipPath id="kh-clip-circle">
          <circle cx="256" cy="256" r="256" />
        </clipPath>
      </defs>
      <g clipPath="url(#kh-clip-circle)">
        {/* Top Blue Stripe */}
        <rect x="0" y="0" width="512" height="128" fill="#032ea1" />
        {/* Center Red Stripe */}
        <rect x="0" y="128" width="512" height="256" fill="#e00025" />
        {/* Bottom Blue Stripe */}
        <rect x="0" y="384" width="512" height="128" fill="#032ea1" />

        {/* Angkor Wat Temple Silhouette (White) */}
        <g fill="#ffffff">
          {/* Base foundation platform */}
          <rect x="146" y="340" width="220" height="14" rx="2" />
          <rect x="156" y="324" width="200" height="16" rx="2" />
          <rect x="170" y="306" width="172" height="18" rx="2" />

          {/* Pillars & Galleries */}
          <rect x="180" y="280" width="152" height="26" />
          <rect x="188" y="284" width="8" height="22" fill="#e00025" />
          <rect x="206" y="284" width="8" height="22" fill="#e00025" />
          <rect x="224" y="284" width="8" height="22" fill="#e00025" />
          <rect x="242" y="284" width="8" height="22" fill="#e00025" />
          <rect x="260" y="284" width="8" height="22" fill="#e00025" />
          <rect x="278" y="284" width="8" height="22" fill="#e00025" />
          <rect x="296" y="284" width="8" height="22" fill="#e00025" />
          <rect x="314" y="284" width="8" height="22" fill="#e00025" />

          {/* Center Main Spire Tower */}
          <path d="M256 160 L240 236 L246 280 L266 280 L272 236 Z" />
          <path d="M256 142 L252 162 L260 162 Z" />
          <circle cx="256" cy="140" r="3.5" />
          {/* Tower detail contours */}
          <path d="M244 210 L268 210 L264 240 L248 240 Z" fill="#e00025" />
          <path d="M251 216 L261 216 L259 236 L253 236 Z" fill="#ffffff" />

          {/* Left Spire Tower */}
          <path d="M204 192 L192 250 L198 280 L216 280 L220 250 Z" />
          <path d="M204 178 L200 194 L208 194 Z" />
          <circle cx="204" cy="176" r="3" />
          <path d="M196 230 L214 230 L212 254 L198 254 Z" fill="#e00025" />

          {/* Right Spire Tower */}
          <path d="M308 192 L296 250 L302 280 L320 280 L324 250 Z" />
          <path d="M308 178 L304 194 L312 194 Z" />
          <circle cx="308" cy="176" r="3" />
          <path d="M300 230 L318 230 L316 254 L302 254 Z" fill="#e00025" />
        </g>
      </g>
    </svg>
  );
}

export function UKFlag({ size = 44, className = '', style = {} }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 512 512"
      width={size}
      height={size}
      className={className}
      style={{
        display: 'inline-block',
        verticalAlign: 'middle',
        borderRadius: '50%',
        flexShrink: 0,
        boxShadow: '0 2px 6px rgba(0,0,0,0.12)',
        ...style,
      }}
      aria-label="United Kingdom Flag"
    >
      <defs>
        <clipPath id="gb-clip-circle">
          <circle cx="256" cy="256" r="256" />
        </clipPath>
        <clipPath id="gb-clip-diagonals">
          <path d="M0 0 L512 512 M512 0 L0 512" strokeWidth="60" stroke="#000" />
        </clipPath>
      </defs>
      <g clipPath="url(#gb-clip-circle)">
        {/* Navy Blue Field */}
        <rect width="512" height="512" fill="#012169" />

        {/* White Saltire (St. Andrew & St. Patrick base) */}
        <line x1="0" y1="0" x2="512" y2="512" stroke="#ffffff" strokeWidth="76" />
        <line x1="512" y1="0" x2="0" y2="512" stroke="#ffffff" strokeWidth="76" />

        {/* Red Saltire (St. Patrick's Cross) */}
        <path
          d="M0 0 L220 220 M512 512 L292 292 M512 0 L292 220 M0 512 L220 292"
          stroke="#c8102e"
          strokeWidth="28"
          strokeLinecap="square"
        />

        {/* White Cross (St. George base) */}
        <rect x="206" y="0" width="100" height="512" fill="#ffffff" />
        <rect x="0" y="206" width="512" height="100" fill="#ffffff" />

        {/* Red Cross (St. George's Cross) */}
        <rect x="226" y="0" width="60" height="512" fill="#c8102e" />
        <rect x="0" y="226" width="512" height="60" fill="#c8102e" />
      </g>
    </svg>
  );
}

