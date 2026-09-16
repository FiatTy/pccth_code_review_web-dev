import { useState, type CSSProperties } from 'react';
import claudeLogo from '@/assets/claude-ai-logo.png';
import googleLogo from '@/assets/Google__G__logo.svg.webp';
import { clientLogo, type ClientLogo } from '@/features/mcp/lib/client-logo';
import { clientHue, clientInitials } from '@/features/mcp/lib/client-mark';

const SIZE = {
  sm: 'h-7 w-7 rounded-lg text-[10px]',
  md: 'h-9 w-9 rounded-xl text-xs',
};

const LOGO: Record<ClientLogo, { src: string; hasOwnBackground: boolean }> = {
  claude: { src: claudeLogo, hasOwnBackground: false },
  google: { src: googleLogo, hasOwnBackground: false },
};

export function ClientMark({
  clientName,
  size = 'md',
}: {
  clientName: string;
  size?: keyof typeof SIZE;
}) {
  const [logoFailed, setLogoFailed] = useState(false);
  const logo = clientLogo(clientName);

  if (logo && !logoFailed) {
    const artwork = LOGO[logo];
    return (
      <span
        className={`flex shrink-0 items-center justify-center overflow-hidden border border-border bg-surface ${SIZE[size]}`}
      >
        <img
          src={artwork.src}
          alt=""
          aria-hidden
          onError={() => setLogoFailed(true)}
          className={
            artwork.hasOwnBackground
              ? 'h-full w-full object-cover'
              : 'h-[64%] w-[64%] object-contain'
          }
        />
      </span>
    );
  }

  const hue = { '--mark-hue': String(clientHue(clientName)) } as CSSProperties;

  return (
    <span
      aria-hidden
      style={hue}
      className={`flex shrink-0 items-center justify-center bg-[hsl(var(--mark-hue)_65%_50%_/_0.16)] font-semibold tracking-tight text-[hsl(var(--mark-hue)_55%_36%)] dark:text-[hsl(var(--mark-hue)_70%_72%)] ${SIZE[size]}`}
    >
      {clientInitials(clientName)}
    </span>
  );
}
