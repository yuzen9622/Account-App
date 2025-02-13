export default function FormatNumber({ number }) {
  const formatter = new Intl.NumberFormat("zh-TW");
  return `${formatter.format(number)}`;
}
