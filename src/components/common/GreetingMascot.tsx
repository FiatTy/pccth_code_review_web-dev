/**
 * Animated greeting mascot for the dashboard header.
 * Daytime (06:00–17:59) → a sleeved hand reaches in from the left offering a
 *   coffee cup, the coffee sloshes, steam rises, the whole scene nudges forward.
 * Nighttime → a round moon in a nightcap bobs and blinks sleepily, ringed by
 *   twinkling stars, with floating Zzz.
 * Both respect prefers-reduced-motion (animations disabled via CSS).
 */
export function GreetingMascot() {
  const hour = new Date().getHours();
  const isNight = hour < 6 || hour >= 18;

  if (isNight) {
    return (
      <svg
        className="greet-mascot"
        style={{ height: '1.9em', width: '2.2em' }}
        viewBox="0 0 56 48"
        fill="none"
        role="img"
        aria-label="Good night"
      >
        {/* twinkling stars */}
        <g fill="var(--accent)">
          <path className="greet-star" d="M48 7l1 3 3 1-3 1-1 3-1-3-3-1 3-1z" />
          <path
            className="greet-star greet-star-2"
            d="M8 12l.8 2.4 2.4.8-2.4.8L8 19l-.8-2.4L4.8 16l2.4-.8z"
          />
          <circle className="greet-star greet-star-3" cx="51" cy="33" r="1.6" />
          <circle className="greet-star greet-star-4" cx="6" cy="33" r="1.3" />
        </g>

        <g className="greet-moon">
          {/* moon face */}
          <circle cx="24" cy="29" r="12" fill="var(--accent)" />
          {/* soft craters */}
          <circle cx="19" cy="32" r="1.8" fill="#00000018" />
          <circle cx="29" cy="34" r="1.3" fill="#00000018" />
          {/* sleepy blinking eyes */}
          <g className="greet-eye">
            <ellipse cx="19" cy="28" rx="1.7" ry="2.4" fill="#153a34" />
          </g>
          <g className="greet-eye">
            <ellipse cx="29" cy="28" rx="1.7" ry="2.4" fill="#153a34" />
          </g>
          {/* tiny sleeping mouth */}
          <path
            d="M22 34q2 1.8 4 0"
            stroke="#153a34"
            strokeWidth="1.5"
            strokeLinecap="round"
            fill="none"
          />
          {/* nightcap: slouchy cap + fluffy band + pom */}
          <path d="M12 19Q24 2 36 15Z" fill="var(--primary)" />
          <rect x="10" y="16" width="28" height="4.4" rx="2.2" fill="var(--primary-hover)" />
          <circle className="greet-pom" cx="36" cy="15" r="3" fill="var(--primary-hover)" />
        </g>

        {/* Zzz */}
        <g fill="currentColor" fontWeight="700" opacity="0.55">
          <text className="greet-zzz" x="38" y="16" fontSize="9">
            z
          </text>
          <text className="greet-zzz greet-zzz-2" x="44" y="9" fontSize="6.5">
            z
          </text>
        </g>
      </svg>
    );
  }

  const skin = '#e3a878';
  const skinLight = '#f0be8f';
  const skinShade = '#c98a5c';

  return (
    <svg
      className="greet-mascot"
      style={{ height: '1.9em', width: '2.7em' }}
      viewBox="0 0 70 50"
      fill="none"
      role="img"
      aria-label="Good day"
    >
      <defs>
        <clipPath id="greet-cup-clip">
          <ellipse cx="46" cy="17" rx="8" ry="2.4" />
        </clipPath>
      </defs>

      {/* wavy steam */}
      <g stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" fill="none" opacity="0.38">
        <path className="greet-steam" d="M43 3c-2.4 2 2.4 4 0 6s2.4 4 0 6" />
        <path className="greet-steam greet-steam-2" d="M51 2c-2.4 2 2.4 4 0 6s2.4 4 0 6" />
      </g>

      <g className="greet-offer">
        {/* sleeve + cuff reaching in from the left */}
        <path d="M0 27q0-1.2 1.2-1.2H14a6.5 6.5 0 0 1 0 13H1.2Q0 38.8 0 37.6z" fill="var(--primary)" />
        <rect x="9" y="25" width="5" height="14" rx="2.4" fill="var(--primary-hover)" />

        {/* mug handle (right) + body */}
        <path d="M54 19.5h3a4.8 4.8 0 0 1 0 9h-3" fill="none" stroke="var(--accent)" strokeWidth="2.8" />
        <path d="M38 17h16v6.5a8 8 0 0 1-16 0z" fill="var(--accent)" />
        {/* body shading */}
        <path d="M50.5 17v6.5a8 8 0 0 1-3.4 6.3A8 8 0 0 0 50.5 17z" fill="#00000012" />

        {/* coffee: dark base + two flowing wave layers, clipped to the rim */}
        <g clipPath="url(#greet-cup-clip)">
          <rect x="37" y="14.5" width="18" height="6" fill="#3d2415" />
          <path
            className="greet-wave"
            d="M29 17.5q2-1.3 4 0t4 0 4 0 4 0 4 0 4 0 4 0 4 0V22H29z"
            fill="#6b4327"
          />
          <path
            className="greet-wave greet-wave-2"
            d="M29 18.3q2-1 4 0t4 0 4 0 4 0 4 0 4 0 4 0 4 0V22H29z"
            fill="#7d4f2e"
            opacity="0.8"
          />
        </g>
        {/* rim */}
        <ellipse cx="46" cy="17" rx="8" ry="2.4" fill="none" stroke="var(--accent)" strokeWidth="1" opacity="0.5" />

        {/* ===== detailed hand: a fist with knuckles gripping the mug's left ===== */}
        {/* back-of-hand + knuckle silhouette */}
        <path
          d="M16 28C13 26 14 22 18 22Q21 19.5 24 22Q27 19.5 30 22Q33 19.5 36 22Q38.5 20 40 23C42 26 40 32 35 35C28 38 18 38 15 34Z"
          fill={skin}
        />
        {/* soft highlight along the knuckles */}
        <path
          d="M18 22Q21 19.8 24 22Q27 19.8 30 22Q33 19.8 36 22"
          fill="none"
          stroke={skinLight}
          strokeWidth="1.2"
          strokeLinecap="round"
          opacity="0.7"
        />
        {/* finger creases */}
        <g stroke={skinShade} strokeWidth="0.7" strokeLinecap="round" opacity="0.6">
          <path d="M24 21.6v4" />
          <path d="M30 21.6v4.2" />
          <path d="M36 22v3.6" />
        </g>
        {/* lower shadow of the hand */}
        <path
          d="M15 34C18 38 28 38 35 35C33 37 27 38 20 37C17 36.5 15.5 35.5 15 34Z"
          fill="#0000000f"
        />
        {/* thumb on the near side, with nail */}
        <path d="M20 31c-2.4 1-3 4-.6 5.6 2 1.4 4.6.6 5.2-1.6.5-2-1-4.6-4.6-4z" fill="#e6ac7e" />
        <ellipse
          cx="21.4"
          cy="33.6"
          rx="1.1"
          ry="1.5"
          fill="#f5d3ab"
          opacity="0.8"
          transform="rotate(-22 21.4 33.6)"
        />
        {/* thumb crease */}
        <path
          d="M24.6 31.6c.6 1.4.4 2.8-.7 3.9"
          fill="none"
          stroke={skinShade}
          strokeWidth="0.7"
          strokeLinecap="round"
          opacity="0.55"
        />
      </g>
    </svg>
  );
}
