export const convertToShortDate = (longDate: string): string => {
  return new Date(longDate).toLocaleString('uk-UA', { timeZone: 'Europe/Kyiv'}).split(',')[0]
}
