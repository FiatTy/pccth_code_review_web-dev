import { useEffect, useRef, useState, type ReactNode } from 'react';

interface RevealProps {
  children: ReactNode;
  /** Stagger delay in ms before this element animates in. */
  delay?: number;
  /** Transition duration in ms (default 700). Lower = snappier. */
  duration?: number;
  /** CSS transition timing function. Use a back-out curve for a springy pop. */
  easing?: string;
  className?: string;
}

function prefersReducedMotion(): boolean {
  return (
    typeof window !== 'undefined' &&
    window.matchMedia('(prefers-reduced-motion: reduce)').matches
  );
}

/**
 * Reveals its children with a premium fade + rise + subtle scale every time
 * they scroll into view — it re-hides once they leave the viewport, so the
 * animation replays on each pass. Honors `prefers-reduced-motion` by showing
 * content immediately with no motion.
 */
export function Reveal({
  children,
  delay = 0,
  duration = 700,
  easing = 'cubic-bezier(0.16, 1, 0.3, 1)',
  className = '',
}: RevealProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [shown, setShown] = useState(prefersReducedMotion);

  useEffect(() => {
    if (prefersReducedMotion()) {
      return;
    }
    const el = ref.current;
    if (!el) {
      return;
    }
    const observer = new IntersectionObserver(
      (entries) => {
        const entry = entries[0];
        if (entry) {
          setShown(entry.isIntersecting);
        }
      },
      { threshold: 0.15, rootMargin: '0px 0px -8% 0px' },
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      style={{
        transitionDelay: shown ? `${delay}ms` : '0ms',
        transitionDuration: `${duration}ms`,
        transitionTimingFunction: easing,
      }}
      className={`transition-all will-change-[transform,opacity] motion-reduce:transition-none ${
        shown ? 'translate-y-0 scale-100 opacity-100' : 'translate-y-8 scale-[0.98] opacity-0'
      } ${className}`}
    >
      {children}
    </div>
  );
}
