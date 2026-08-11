export default function Logo({ className = '' }: { className?: string }) {
  return (
    <svg viewBox="0 0 400 350" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
      <path d="M200 290 C200 290 55 210 55 125 C55 70 95 35 140 35 C175 35 195 55 200 75 C205 55 225 35 260 35 C305 35 345 70 345 125 C345 210 200 290 200 290Z" fill="url(#hg)" />
      <path d="M200 75 C195 55 175 35 140 35 C95 35 55 70 55 125 C55 210 200 290 200 290" stroke="#D71920" strokeWidth="7" fill="none" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M200 75 C205 55 225 35 260 35 C305 35 345 70 345 125 C345 210 200 290 200 290" stroke="#0B2A4A" strokeWidth="7" fill="none" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M105 155 L155 155 L170 125 L185 185 L200 95 L215 175 L230 135 L245 155 L295 155" stroke="white" strokeWidth="4.5" fill="none" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M115 250 C115 250 140 272 165 277 C180 280 195 275 200 265 C205 275 220 280 235 277 C260 272 285 250 285 250" stroke="#0B2A4A" strokeWidth="5.5" fill="none" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M130 260 C130 260 155 280 175 282 C190 283 198 278 200 270 C202 278 210 283 225 282 C245 280 270 260 270 260" stroke="#0B2A4A" strokeWidth="3.5" fill="none" strokeLinecap="round" strokeLinejoin="round" />
      <ellipse cx="200" cy="295" rx="70" ry="5" fill="#0B2A4A" opacity="0.08" />
      <defs>
        <linearGradient id="hg" x1="55" y1="35" x2="345" y2="290">
          <stop offset="0%" stopColor="#D71920" />
          <stop offset="50%" stopColor="#D71920" />
          <stop offset="50%" stopColor="#0B2A4A" />
          <stop offset="100%" stopColor="#0B2A4A" />
        </linearGradient>
      </defs>
    </svg>
  );
}

export function LogoMark({ className = '' }: { className?: string }) {
  return (
    <svg viewBox="0 0 60 60" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
      <path d="M30 52 C30 52 6 36 6 18 C6 9 12 4 19 4 C24 4 28 8 30 12 C32 8 36 4 41 4 C48 4 54 9 54 18 C54 36 30 52 30 52Z" fill="url(#mg)" />
      <path d="M14 28 L22 28 L25 22 L28 34 L31 16 L34 32 L37 26 L40 28 L48 28" stroke="white" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round" />
      <defs>
        <linearGradient id="mg" x1="6" y1="4" x2="54" y2="52">
          <stop offset="0%" stopColor="#D71920" />
          <stop offset="50%" stopColor="#D71920" />
          <stop offset="50%" stopColor="#0B2A4A" />
          <stop offset="100%" stopColor="#0B2A4A" />
        </linearGradient>
      </defs>
    </svg>
  );
}

export function LogoFull({ className = '' }: { className?: string }) {
  return (
    <div className={`flex items-center gap-3 ${className}`}>
      <LogoMark className="w-10 h-10" />
      <div className="leading-none">
        <span className="font-bold text-lg text-[#0B2A4A] block tracking-tight">Healing Hearts</span>
        <span className="text-[9px] text-[#D71920] font-bold uppercase tracking-[0.25em]">Foundation</span>
      </div>
    </div>
  );
}
