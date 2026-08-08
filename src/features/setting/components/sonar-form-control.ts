import type { SonarQubeFormState } from '@/features/setting/lib/sonar-form';

export interface SonarFormControl {
  form: SonarQubeFormState;
  errors: { serverUrl: string; authToken: string; gitAccessToken: string };
  touched: Record<string, boolean>;
  update: (patch: Partial<SonarQubeFormState>) => void;
  markTouched: (field: string) => void;
}
