export function TriggmaMark({ size = 32 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 512 512" fill="none" aria-hidden xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="trgMark" x1="40" y1="40" x2="472" y2="472" gradientUnits="userSpaceOnUse">
          <stop stopColor="#2563EB" />
          <stop offset="1" stopColor="#7C3AED" />
        </linearGradient>
      </defs>
      <rect x="16" y="16" width="480" height="480" rx="120" fill="url(#trgMark)" />
      {/* Top bar of the "T" */}
      <rect x="120" y="120" width="272" height="56" rx="28" fill="#fff" />
      {/* Vertical stem of the "T" */}
      <rect x="150" y="176" width="56" height="210" rx="28" fill="#fff" />
      {/* Upward growth arrow crossing the stem */}
      <path
        d="M150 360 L330 232"
        stroke="#fff"
        strokeWidth="48"
        strokeLinecap="round"
      />
      <path d="M286 214 h74 v74" stroke="#fff" strokeWidth="48" strokeLinecap="round" strokeLinejoin="round" fill="none" />
      {/* Soft dots along the arrow */}
      <circle cx="206" cy="330" r="15" fill="#C4B5FD" />
      <circle cx="270" cy="285" r="13" fill="#BFDBFE" />
    </svg>
  );
}

export function Logo({
  size = 28,
  light = false,
}: {
  size?: number;
  light?: boolean;
}) {
  return (
    <span className="inline-flex items-center gap-2 font-extrabold tracking-tight">
      <TriggmaMark size={size} />
      <span
        className={light ? "text-white" : "text-brand-ink"}
        style={{ fontSize: size * 0.78, letterSpacing: "-0.02em" }}
      >
        triggma
      </span>
    </span>
  );
}
