export function Logo({
  size = 28,
  light = false,
}: {
  size?: number;
  light?: boolean;
}) {
  return (
    <span className="inline-flex items-center gap-2 font-extrabold tracking-tight">
      <svg width={size} height={size} viewBox="0 0 64 64" fill="none" aria-hidden>
        <defs>
          <linearGradient id="trg" x1="0" y1="0" x2="64" y2="64" gradientUnits="userSpaceOnUse">
            <stop stopColor="#2DD4BF" />
            <stop offset="0.55" stopColor="#2563EB" />
            <stop offset="1" stopColor="#7C3AED" />
          </linearGradient>
        </defs>
        <rect width="64" height="64" rx="16" fill="url(#trg)" />
        <path d="M24 18l22 14-22 14V18z" fill="#fff" />
      </svg>
      <span
        className={light ? "text-white" : "text-brand-ink"}
        style={{ fontSize: size * 0.78, letterSpacing: "-0.02em" }}
      >
        triggma
      </span>
    </span>
  );
}
