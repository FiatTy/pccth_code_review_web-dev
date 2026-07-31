import logoUrl from '@/assets/logo.png';

interface BrandMarkProps {
  size?: number;
  showWordmark?: boolean;
}

export function BrandMark({ size = 28, showWordmark = true }: BrandMarkProps) {
  // Wordmark scales with the logo; anchored so size 28 keeps the original 14px / 9px.
  const titleSize = Math.round(size * 0.5);
  const subtitleSize = Math.min(Math.max(Math.round(size * 0.32), 8), 12);

  return (
    <div className="flex items-center" style={{ gap: Math.round(size * 0.22) }}>
      <img
        src={logoUrl}
        alt="PCCTH Automate Code Review"
        width={size}
        height={size}
        className="shrink-0 object-contain"
        style={{ width: size, height: size }}
      />
      {showWordmark ? (
        <div className="flex flex-col leading-none">
          <span
            className="font-semibold tracking-tight text-fg"
            style={{ fontSize: titleSize }}
          >
            Code Review
          </span>
          <span
            className="font-mono uppercase tracking-[0.2em] text-faint"
            style={{ fontSize: subtitleSize }}
          >
            PCCTH
          </span>
        </div>
      ) : null}
    </div>
  );
}
