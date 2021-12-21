export function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

const dashFormatRegex = /(\d{4})-(\d{2})-(\d{2})$/;

export function validateRangeDateFormat(date: string) {
  return dashFormatRegex.test(date);
}
