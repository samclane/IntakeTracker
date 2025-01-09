import { Drink } from "../types/Drink";

// Trigger a file download by creating an <a> element and clicking it
function downloadFile(data: string, filename: string, mimeType: string) {
  const dataStr = `data:${mimeType};charset=utf-8,` + encodeURIComponent(data);
  const link = document.createElement("a");
  link.setAttribute("href", dataStr);
  link.setAttribute("download", filename);
  link.click();
}

/**
 * Export drinks as JSON
 */
export function exportJSON(drinks: Drink[]) {
  const jsonStr = JSON.stringify(drinks, null, 2); // pretty-print
  downloadFile(jsonStr, "drinks.json", "application/json");
}

/**
 * Export drinks as CSV
 * We'll export columns: id, name, volume, abv, date
 */
export function exportCSV(drinks: Drink[]) {
  // Header row
  const headers = ["id", "name", "volume(ml)", "abv", "date"];

  // Convert each Drink to a CSV row
  const rows = drinks.map((d) => {
    // The date might be stored as a Date object or string.
    // We'll convert to ISO string for CSV.
    const dateStr = d.date instanceof Date ? d.date.toISOString() : d.date;
    return [d.id, escapeCsvValue(d.name), d.volume, d.abv, dateStr].join(",");
  });

  // Combine header + rows
  const csvContent = [headers.join(","), ...rows].join("\n");

  downloadFile(csvContent, "drinks.csv", "text/csv");
}

/**
 * Escape commas or quotes if needed (simple approach).
 * For a more robust solution, consider fully quoting values
 * or using a dedicated CSV utility library.
 */
function escapeCsvValue(value: string | number): string {
  // Convert value to string, replace double-quotes
  const strVal = String(value).replace(/"/g, '""');
  // Wrap in quotes if it contains a comma
  if (strVal.indexOf(",") >= 0) {
    return `"${strVal}"`;
  }
  return strVal;
}
