import { describe, expect, it } from 'vitest';
import { parseGitUrl } from './git-utils';

describe('parseGitUrl', () => {
  it('should extract folder and project name from git.pccth.com nested URL', () => {
    const result = parseGitUrl(
      'https://git.pccth.com/cgd-egp-pccth/cgd-0004-63/egp-ecdoc1-service.git',
    );
    expect(result.folder).toBe('cgd-egp-pccth');
    expect(result.projectName).toBe('egp-ecdoc1-service');
  });

  it('should extract folder and project name from standard github URL', () => {
    const result = parseGitUrl('https://github.com/tonkla785/Pcc_Code_Review');
    expect(result.folder).toBe('tonkla785');
    expect(result.projectName).toBe('Pcc_Code_Review');
  });

  it('should handle SSH format URLs', () => {
    const result = parseGitUrl(
      'git@git.pccth.com:cgd-egp-pccth/cgd-0004-63/egp-ecdoc1-service.git',
    );
    expect(result.folder).toBe('cgd-egp-pccth');
    expect(result.projectName).toBe('egp-ecdoc1-service');
  });

  it('should handle empty or single segment URLs gracefully', () => {
    expect(parseGitUrl('')).toEqual({ folder: 'General', projectName: '', fullPath: '' });
    expect(parseGitUrl('https://git.pccth.com/myrepo.git')).toEqual({
      folder: 'General',
      projectName: 'myrepo',
      fullPath: 'myrepo',
    });
  });
});
