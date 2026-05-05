export const formatTimestamp = (
  timestamp: number,
  includeTime: boolean = true,
  locale: string = 'id-ID'
): string => {
  // Menangani timestamp dalam detik (10 digit) dengan mengonversinya ke milidetik
  const date = new Date(timestamp.toString().length === 10 ? timestamp * 1000 : timestamp);

  const options: Intl.DateTimeFormatOptions = {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  };

  if (includeTime) {
    options.hour = '2-digit';
    options.minute = '2-digit';
    options.second = '2-digit';
    options.hour12 = false; // Gunakan format 24 jam
  }

  return new Intl.DateTimeFormat(locale, options).format(date);
};