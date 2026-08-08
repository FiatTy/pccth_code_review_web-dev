import { describe, expect, it } from 'vitest';
import { isQualityGatePassed } from '@/features/scan/lib/scan-rating';

describe('isQualityGatePassed', () => {
  it('passes only on OK', () => {
    expect(isQualityGatePassed({ qualityGate: 'OK' })).toBe(true);
    expect(isQualityGatePassed({ qualityGate: 'ERROR' })).toBe(false);
  });

  it('normalises the casing and padding SonarQube sends back', () => {
    expect(isQualityGatePassed({ qualityGate: 'ok' })).toBe(true);
    expect(isQualityGatePassed({ qualityGate: '  OK  ' })).toBe(true);
  });

  it('treats a missing gate as not passed rather than throwing', () => {
    expect(isQualityGatePassed({ qualityGate: null })).toBe(false);
    expect(isQualityGatePassed({ qualityGate: undefined })).toBe(false);
    expect(isQualityGatePassed({ qualityGate: '' })).toBe(false);
  });
});
