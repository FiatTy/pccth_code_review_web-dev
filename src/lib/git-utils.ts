export interface ParsedGitUrl {
  folder: string;
  projectName: string;
  fullPath: string;
}

/**
 * Parses Git URL and extracts Folder/Group name (แฟ้ม) and Project/Repo name.
 * Example:
 *   "https://git.pccth.com/cgd-egp-pccth/cgd-0004-63/egp-ecdoc1-service.git"
 *   -> folder: "cgd-egp-pccth", projectName: "egp-ecdoc1-service"
 *
 *   "https://github.com/tonkla785/Pcc_Code_Review"
 *   -> folder: "tonkla785", projectName: "Pcc_Code_Review"
 */
export function parseGitUrl(url: string): ParsedGitUrl {
  if (!url || !url.trim()) {
    return { folder: 'General', projectName: '', fullPath: '' };
  }

  let cleanUrl = url.trim();
  cleanUrl = cleanUrl.split('?')[0].split('#')[0];
  cleanUrl = cleanUrl.replace(/\/+$/, '').replace(/\.git$/i, '');

  let pathPart: string;

  if (cleanUrl.includes('://')) {
    try {
      const parsed = new URL(cleanUrl);
      pathPart = parsed.pathname;
    } catch {
      pathPart = cleanUrl.replace(/^https?:\/\/[^/]+/, '');
    }
  } else if (cleanUrl.includes('@') && cleanUrl.includes(':')) {
    pathPart = cleanUrl.split(':')[1] || '';
  } else {
    pathPart = cleanUrl;
  }

  const segments = pathPart
    .split('/')
    .map((s) => s.trim())
    .filter(Boolean);

  if (segments.length === 0) {
    return { folder: 'General', projectName: '', fullPath: '' };
  }

  const projectName = segments[segments.length - 1];
  const folder = segments.length > 1 ? segments[0] : 'General';
  const fullPath = segments.join('/');

  return { folder, projectName, fullPath };
}
