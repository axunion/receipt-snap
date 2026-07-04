export function parseAmount(formattedValue: string): number {
  const numbersOnly = formattedValue.replace(/[^\d]/g, "");
  return numbersOnly ? Number(numbersOnly) : 0;
}
