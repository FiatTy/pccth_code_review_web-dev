export function clientInitials(clientName: string): string {
  const withoutBrackets = clientName.replace(/\([^)]*\)/g, ' ');
  const words = withoutBrackets
    .split(/[^\p{L}\p{N}]+/u)
    .filter((word) => word.length > 0);

  if (words.length === 0) {
    return '?';
  }
  if (words.length === 1) {
    return words[0].slice(0, 2).toUpperCase();
  }
  return (words[0][0] + words[1][0]).toUpperCase();
}

export function clientHue(clientName: string): number {
  let hash = 0;
  for (const character of clientName) {
    hash = (hash * 31 + character.codePointAt(0)!) % 360;
  }
  return hash;
}
