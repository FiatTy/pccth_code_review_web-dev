export type ClientLogo = 'claude' | 'google';

const MARKS: [ClientLogo, RegExp][] = [
  ['claude', /\b(claude|anthropic)\b/i],
  ['google', /\b(google|gemini|antigravity)\b/i],
];

export function clientLogo(clientName: string): ClientLogo | null {
  for (const [logo, pattern] of MARKS) {
    if (pattern.test(clientName)) {
      return logo;
    }
  }
  return null;
}
