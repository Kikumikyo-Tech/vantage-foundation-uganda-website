const isoDatePattern = /^\d{4}-\d{2}-\d{2}$/;

export function formatContentDate(value: string) {
  if (!isoDatePattern.test(value)) return value;

  const date = new Date(`${value}T00:00:00Z`);
  if (Number.isNaN(date.getTime())) return value;

  return new Intl.DateTimeFormat("en-GB", {
    day: "numeric",
    month: "long",
    year: "numeric",
    timeZone: "UTC",
  }).format(date);
}
