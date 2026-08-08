import { useTranslation } from 'react-i18next';
import { FIELD_INPUT_CLASS, FormField } from '@/components/common/FormField';
import { SelectField } from '@/components/common/SelectField';

export interface AssignableUser {
  id: string;
  username: string;
}

interface UserSelectProps {
  id: string;
  value: string;
  onChange: (value: string) => void;
  users: AssignableUser[];
  isPending?: boolean;
  isError?: boolean;
  error?: string;
}

export function UserSelect({
  id,
  value,
  onChange,
  users,
  isPending,
  isError,
  error,
}: UserSelectProps) {
  const { t } = useTranslation();
  const isEmpty = !isPending && !isError && users.length === 0;
  const unavailable = Boolean(isError) || isEmpty;

  let unavailableMessage: string | undefined;
  if (isError) {
    unavailableMessage = t('ISSUE_MODAL.USER_LIST_ERROR');
  } else if (isEmpty) {
    unavailableMessage = t('ISSUE_MODAL.USER_LIST_EMPTY');
  }

  return (
    <FormField id={id} label={t('ISSUE_MODAL.ASSIGN_TO')} error={error || unavailableMessage}>
      <SelectField
        id={id}
        className={FIELD_INPUT_CLASS}
        value={value}
        disabled={isPending || unavailable}
        onChange={onChange}
        placeholder={isPending ? t('COMMON.LOADING') : t('ISSUE_MODAL.SELECT_USER')}
        options={users.map((user) => ({ value: user.id, label: user.username }))}
      />
    </FormField>
  );
}
