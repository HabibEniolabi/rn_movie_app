export const formatNumber = (
  value: number | string,
  language: string
) => {
  const numericValue = Number(value);

  if (Number.isNaN(numericValue)) {
    return String(value);
  }

  const lang = language.split("-")[0];

  if (lang === "ar") {
    return new Intl.NumberFormat("ar-EG").format(numericValue);
  }

  return new Intl.NumberFormat(lang).format(numericValue);
};