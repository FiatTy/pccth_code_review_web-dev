const WITH_YEAR: Intl.DateTimeFormatOptions = {
  year: 'numeric',
  month: 'short',
  day: '2-digit',
  hour: '2-digit',
  minute: '2-digit',
};

const WITHOUT_YEAR: Intl.DateTimeFormatOptions = {
  month: 'short',
  day: '2-digit',
  hour: '2-digit',
  minute: '2-digit',
};

function format(value: string | null | undefined, options: Intl.DateTimeFormatOptions) {
  if (!value) {
    return null;
  }
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) {
    return null;
  }
  return date.toLocaleString(undefined, options);
}

export function formatDateTime(value?: string | null): string | null {
  return format(value, WITH_YEAR);
}

export function formatDateTimeShort(value?: string | null): string | null {
  return format(value, WITHOUT_YEAR);
}
