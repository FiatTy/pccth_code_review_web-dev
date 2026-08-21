import { describe, expect, it } from 'vitest';
import {
  DEFAULT_EXCLUSIONS,
  isGitTokenValid,
  readNumber,
  toFormState,
  trimForm,
  type SonarQubeFormState,
} from '@/features/setting/lib/sonar-form';
import type { SonarQubeConfig } from '@/features/setting/types';

const config = (patch: Partial<SonarQubeConfig>) => patch as SonarQubeConfig;

describe('readNumber', () => {
  it('rejects anything that is not a finite number', () => {
    expect(readNumber('')).toBe(0);
    expect(readNumber('abc')).toBe(0);
    expect(readNumber('Infinity')).toBe(0);
  });

  it('never lets a threshold go negative or fractional', () => {
    expect(readNumber('-5')).toBe(0);
    expect(readNumber('3.6')).toBe(4);
  });

  it('clamps to the max when one is given', () => {
    expect(readNumber('150', 100)).toBe(100);
    expect(readNumber('80', 100)).toBe(80);
  });
});

describe('toFormState', () => {
  it('falls back to the default exclusions when the server sends none', () => {
    expect(toFormState(config({ angularExclusions: '' })).angularExclusions).toBe(DEFAULT_EXCLUSIONS);
  });

  it('only accepts gradle as an alternative build tool', () => {
    expect(toFormState(config({ springBuildTool: 'gradle' })).springBuildTool).toBe('gradle');
    expect(toFormState(config({ springBuildTool: 'ant' as never })).springBuildTool).toBe('maven');
  });

  it('keeps a zero threshold instead of treating it as missing', () => {
    expect(toFormState(config({ qgMaxBugs: 0 })).qgMaxBugs).toBe(0);
  });
});

describe('isGitTokenValid', () => {
  it('accepts an empty field now that connecting GitLab replaces the manual token', () => {
    expect(isGitTokenValid('')).toBe(true);
    expect(isGitTokenValid('   ')).toBe(true);
  });

  it('still rejects a token too short to be real', () => {
    expect(isGitTokenValid('xxxx')).toBe(false);
  });

  it('accepts a token once it reaches the minimum length', () => {
    expect(isGitTokenValid('glpat-1234')).toBe(true);
  });
});

describe('trimForm', () => {
  it('trims the fields that get pasted with stray whitespace', () => {
    const trimmed = trimForm({
      serverUrl: '  https://sonar.local  ',
      authToken: ' token ',
      organization: ' org ',
      gitAccessToken: ' git ',
      angularExclusions: ' **/x ',
    } as SonarQubeFormState);

    expect(trimmed.serverUrl).toBe('https://sonar.local');
    expect(trimmed.authToken).toBe('token');
    expect(trimmed.organization).toBe('org');
    expect(trimmed.gitAccessToken).toBe('git');
    expect(trimmed.angularExclusions).toBe('**/x');
  });
});
