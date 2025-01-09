export interface ChartRow {
  // 'date' is the string used for xAxis dataKey
  date: string;
  // Each drink name maps to a number or 0 if no data
  // We can allow arbitrary keys with [key: string]: number | string
  [key: string]: string | number;
}
