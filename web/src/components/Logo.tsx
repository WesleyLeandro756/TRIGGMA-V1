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
      {/* Top bar of the centered "T" */}
      <rect x="130" y="128" width="252" height="54" rx="27" fill="#fff" />
      {/* Centered vertical stem of the "T" */}
      <rect x="228" y="182" width="56" height="200" rx="28" fill="#fff" />
      {/* Upward growth arrow crossing the stem */}
      <path d="M150 356 L362 206" stroke="#fff" strokeWidth="46" strokeLinecap="round" />
      <path d="M316 206 h46 v46" stroke="#fff" strokeWidth="46" strokeLinecap="round" strokeLinejoin="round" fill="none" />
      {/* Soft dots along the arrow */}
      <circle cx="196" cy="328" r="15" fill="#C4B5FD" />
      <circle cx="262" cy="281" r="13" fill="#BFDBFE" />
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
