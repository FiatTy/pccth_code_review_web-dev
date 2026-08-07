/**
 * Animated greeting mascot for the dashboard header.
 * Daytime (06:00–17:59) → a cuffed hand grips a lidded takeaway cup from the
 *   side: thumb pressed on the near face, fingertips curling over the far edge.
 *   The arm drifts along a slow loop while the wrist sways on a different beat,
 *   and steam drifts off the lid.
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
  const nailPlate = '#f6cdb2'; // nail bed: paler and pinker than the skin around it
  const nailEdge = '#fdece0'; // the free edge at the tip catches the light

  return (
    <svg
      className="greet-mascot"
      style={{ height: '1.9em', width: '2.15em' }}
      viewBox="0 0 54 48"
      fill="none"
      role="img"
      aria-label="Good day"
    >
      <g className="greet-offer">
        {/* steam drifting off the lid */}
        <g stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" fill="none" opacity="0.3">
          <path className="greet-steam" d="M34 2.6c-1.7 1.5 1.7 2.9 0 4.4" />
          <path className="greet-steam greet-steam-2" d="M38 1.4c-1.7 1.5 1.7 2.9 0 4.4" />
          <path className="greet-steam greet-steam-3" d="M42 2.6c-1.7 1.5 1.7 2.9 0 4.4" />
        </g>

        {/* hand + cup move as one rigid grip, pivoting at the wrist */}
        <g className="greet-sway">
          {/* back of the hand — mostly hidden behind the cup, only the near edge shows */}
          <ellipse cx="27.5" cy="37.5" rx="9" ry="6.4" fill={skin} transform="rotate(-12 27.5 37.5)" />
          <path d="M19.5 41.4c3 2.3 8.4 2.7 12.2 1.1-2.4 2.3-8.6 2.6-12.2-1.1z" fill="#00000012" />

          {/* takeaway cup: stepped lid, tapered body, kraft sleeve.
              currentColor outline keeps the line-art contrast in both themes —
              --border-strong all but disappears against the dark surface. */}
          <g fill="var(--surface)" stroke="currentColor" strokeOpacity="0.28" strokeWidth="1.1">
            <rect x="26" y="9" width="24" height="6" rx="2.6" />
            <rect x="28" y="14.6" width="20" height="3.2" rx="1.4" />
            <path d="M28.8 17.4h18.4l-2.6 22.4a3 3 0 0 1-3 2.6h-7.2a3 3 0 0 1-3-2.6z" />
          </g>
          <path d="M29.3 22h17.4l-1.2 12H30.5z" fill="var(--accent)" />
          <path d="M43.4 22h3.3l-1.2 12h-3.3z" fill="#0000000f" />

          {/* fingertips curling over the far edge — each overlaps the cup outline
              so the grip reads as "wrapped around" rather than "resting beside" */}
          <g fill={skin} stroke={skinShade} strokeWidth="0.6" strokeOpacity="0.45">
            <rect className="greet-finger" x="43.4" y="19.4" width="6.3" height="4.1" rx="2.05" />
            <rect
              className="greet-finger greet-finger-2"
              x="43.1"
              y="24.8"
              width="6.4"
              height="4.1"
              rx="2.05"
            />
            <rect
              className="greet-finger greet-finger-3"
              x="42.8"
              y="30.2"
              width="6.2"
              height="3.9"
              rx="1.95"
            />
          </g>

          {/* Thumb laid along the near face of the sleeve. It is drawn as one
              unstroked shape whose base flares into the palm — an outlined
              capsule reads as a separate part glued on. The two creases (knuckle
              + thenar) are what sell it as a joint instead of a seam. */}
          <g transform="rotate(14 30.3 29.75)">
            <path
              d="M27.6 25.3a2.7 2.7 0 0 1 5.4 0c0 3.4.8 6.4 1.1 9.2.35 3.3-7.9 3.7-7.9.2 0-2.7 1.4-5.8 1.4-9.4z"
              fill={skinLight}
            />
            <g
              fill="none"
              stroke={skinShade}
              strokeWidth="0.55"
              strokeOpacity="0.45"
              strokeLinecap="round"
            >
              <path d="M28.2 29.3c1.4 1 3 1 4.4-.1" />
              <path d="M26.7 34.5c2.3 1.9 5.4 2 7.5.2" />
            </g>
            {/* nail: plate + lighter free edge, ringed so it reads against the skin */}
            <ellipse
              cx="30.3"
              cy="25.2"
              rx="1.75"
              ry="2.1"
              fill={nailPlate}
              stroke={skinShade}
              strokeWidth="0.45"
              strokeOpacity="0.5"
            />
            <path
              d="M28.85 25a1.6 1.9 0 0 1 2.9 0"
              fill="none"
              stroke={nailEdge}
              strokeWidth="0.8"
              strokeLinecap="round"
            />
          </g>
        </g>

        {/* Shirt sleeve, angled toward the wrist and drawn last so the cuff hides
            the wrist seam as the hand sways. The band sits at the end of the
            sleeve (not across its middle) so it reads as a real buttoned cuff. */}
        <g transform="rotate(-12 8 40.4)">
          {/* forearm, long and slim so it reads as a limb entering frame rather
              than a block; the left end runs past the viewBox */}
          <path d="M-16 33.4h27v14h-27z" fill="var(--primary)" />
          <path d="M-16 43.9h27v3.5h-27z" fill="#00000016" />
          <g stroke="#ffffff" strokeOpacity="0.16" strokeWidth="0.8" strokeLinecap="round">
            <path d="M-7.5 35v10.8" />
            <path d="M-1 34.6v11.4" />
            <path d="M4.4 35.2v10.4" />
          </g>
          {/* cuff: same cloth lifted a touch, so the seam reads as a fold in the
              fabric — a darker block here looks like a separate object */}
          <path
            d="M11 32.8h6.2a3.2 3.2 0 0 1 3.2 3.2v8.8a3.2 3.2 0 0 1-3.2 3.2H11z"
            fill="var(--primary)"
          />
          <path
            d="M11 32.8h6.2a3.2 3.2 0 0 1 3.2 3.2v8.8a3.2 3.2 0 0 1-3.2 3.2H11z"
            fill="#ffffff"
            opacity="0.1"
          />
          <path d="M11.2 33.2v14.6" stroke="#00000026" strokeWidth="0.7" strokeLinecap="round" />
          <circle cx="15.4" cy="40.4" r="0.95" fill="var(--surface)" opacity="0.9" />
        </g>
      </g>
    </svg>
  );
}
