export default function Logo({ className = '' }: { className?: string }) {
  return (
    <svg viewBox="0 0 400 320" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
      {/* Heart shape - left red half */}
      <path
        d="M200 280 C200 280 60 200 60 120 C60 70 100 40 140 40 C170 40 190 60 200 80 C210 60 230 40 260 40 C300 40 340 70 340 120 C340 200 200 280 200 280Z"
        fill="url(#heartGradient)"
      />
      {/* Heart outline - blue right curve */}
      <path
        d="M200 80 C210 60 230 40 260 40 C300 40 340 70 340 120 C340 200 200 280 200 280"
        stroke="#1e3a5f" strokeWidth="8" fill="none" strokeLinecap="round"
      />
      {/* Heart outline - red left curve */}
      <path
        d="M200 80 C190 60 170 40 140 40 C100 40 60 70 60 120 C60 200 200 280 200 280"
        stroke="#c41e3a" strokeWidth="8" fill="none" strokeLinecap="round"
      />
      {/* ECG heartbeat line */}
      <path
        d="M100 150 L150 150 L165 120 L180 180 L195 100 L210 170 L225 130 L240 150 L300 150"
        stroke="white" strokeWidth="4" fill="none" strokeLinecap="round" strokeLinejoin="round"
      />
      {/* Hands holding heart */}
      <path
        d="M120 240 C120 240 140 260 160 265 C175 268 190 265 200 255 C210 265 225 268 240 265 C260 260 280 240 280 240"
        stroke="#1e3a5f" strokeWidth="6" fill="none" strokeLinecap="round"
      />
      <path
        d="M130 250 C130 250 150 270 170 273 C185 275 195 270 200 262 C205 270 215 275 230 273 C250 270 270 250 270 250"
        stroke="#1e3a5f" strokeWidth="4" fill="none" strokeLinecap="round"
      />
      {/* Shadow under hands */}
      <ellipse cx="200" cy="285" rx="80" ry="6" fill="#e5e7eb" opacity="0.5" />

      <defs>
        <linearGradient id="heartGradient" x1="60" y1="40" x2="340" y2="280">
          <stop offset="0%" stopColor="#c41e3a" />
          <stop offset="50%" stopColor="#c41e3a" />
          <stop offset="50%" stopColor="#1e3a5f" />
          <stop offset="100%" stopColor="#1e3a5f" />
        </linearGradient>
      </defs>
    </svg>
  );
}

export function LogoMark({ className = '' }: { className?: string }) {
  return (
    <svg viewBox="0 0 60 60" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
      <path
        d="M30 50 C30 50 8 35 8 18 C8 10 14 5 20 5 C24 5 28 8 30 12 C32 8 36 5 40 5 C46 5 52 10 52 18 C52 35 30 50 30 50Z"
        fill="url(#markGrad)"
      />
      <path
        d="M14 28 L22 28 L25 22 L28 34 L31 16 L34 32 L37 26 L40 28 L48 28"
        stroke="white" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round"
      />
      <defs>
        <linearGradient id="markGrad" x1="8" y1="5" x2="52" y2="50">
          <stop offset="0%" stopColor="#c41e3a" />
          <stop offset="50%" stopColor="#c41e3a" />
          <stop offset="50%" stopColor="#1e3a5f" />
          <stop offset="100%" stopColor="#1e3a5f" />
        </linearGradient>
      </defs>
    </svg>
  );
}
