import { isTokenLive } from '@/features/mcp/lib/mcp-access';
import type { McpAccessGrant } from '@/features/mcp/types';

export interface PersonAccess {
  principalName: string;
  grants: McpAccessGrant[];
  inUse: number;
  lastUsedAt: string | null;
}

function millis(iso: string | null): number {
  if (!iso) {
    return Number.NEGATIVE_INFINITY;
  }
  const at = Date.parse(iso);
  return Number.isFinite(at) ? at : Number.NEGATIVE_INFINITY;
}

export function groupByPerson(
  grants: McpAccessGrant[],
  now: number = Date.now(),
): PersonAccess[] {
  const people = new Map<string, McpAccessGrant[]>();

  for (const grant of grants) {
    const held = people.get(grant.principalName);
    if (held) {
      held.push(grant);
    } else {
      people.set(grant.principalName, [grant]);
    }
  }

  return [...people.entries()]
    .map(([principalName, held]) => {
      const sorted = [...held].sort(
        (a, b) => millis(b.lastUsedAt) - millis(a.lastUsedAt),
      );
      return {
        principalName,
        grants: sorted,
        inUse: sorted.filter((grant) =>
          isTokenLive(grant.accessTokenExpiresAt, now),
        ).length,
        lastUsedAt: sorted.length > 0 ? sorted[0].lastUsedAt : null,
      };
    })
    .sort((a, b) => millis(b.lastUsedAt) - millis(a.lastUsedAt));
}
