export const example = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 400">
  <defs>
    <linearGradient id="sky" x2="0%" y2="100%">
      <stop stop-color="#172554"/>
      <stop offset="1" stop-color="#41518b"/>
    </linearGradient>
    <clipPath id="frame"><rect width="640" height="400" rx="16"/></clipPath>
  </defs>
  <g clip-path="url(#frame)">
    <path fill="url(#sky)" d="M0 0h640v400H0z"/>
    <circle cx="465" cy="116" r="54" fill="#fde68a"/>
    <g fill="#d8e7ff">
      <circle cx="105" cy="78" r="3"/><circle cx="189" cy="55" r="2"/>
      <circle cx="279" cy="106" r="2"/><circle cx="559" cy="69" r="3"/>
    </g>
    <path d="M0 278 162 121l125 128 64-63 104 102 76-71 109 95v88H0z" fill="#91a5cd"/>
    <path d="m162 121 63 65-24-8-18 15-19-14-21 11-26-25z" fill="#ecf4ff"/>
    <path d="M0 322c100-41 165-55 253-15 103 47 177-26 252-17 52 6 102 26 135 46v64H0z" fill="#415c90"/>
    <path d="M0 351c80-40 131-15 208 2s122-51 210-48c85 3 143 54 222 48v47H0z" fill="#23395d"/>
    <path d="M0 380c86-31 119 11 195 11 92 0 121-66 223-62 80 3 135 50 222 42" fill="none" stroke="#9cb6da" stroke-opacity=".7" stroke-width="2"/>
  </g>
</svg>`
