import { Drink } from "../types/Drink";

/**
 * Parse a JSON string into a Drink array.
 * We also convert each `date` field from string -> Date object.
 */
export function parseDrinksJSON(jsonStr: string): Drink[] {
  try {
    const data = JSON.parse(jsonStr);
    if (!Array.isArray(data)) {
      throw new Error("JSON is not an array");
    }
    return data.map((d: Drink) => ({
      ...d,
      date: new Date(d.date),
    })) as Drink[];
  } catch (err) {
    console.error("Invalid JSON:", err);
    return [];
  }
}

/**
 * Parse CSV content into a Drink array.
 * We'll assume columns: id, name, volume, abv, date
 */
export function parseDrinksCSV(csvStr: string): Drink[] {
  // Split into lines
  const lines = csvStr.split(/\r?\n/);

  // Basic validation:
  // e.g. optional: check that header has exactly these 5 columns in the correct order
  // If you want to be more flexible, you'd map them dynamically.

  const drinks: Drink[] = [];
  // Start from the second line
  for (let i = 1; i < lines.length; i++) {
    const line = lines[i].trim();
    if (!line) continue; // skip empty lines
    const cols = line.split(",");

    // If columns might have quotes or commas, you'd want a more robust parser (like PapaParse).
    // For this demo, we assume columns are not quoted or the user doesn't put commas in them.

    // Columns: id, name, volume, abv, date
    const id = parseInt(cols[0], 10);
    const name = unescapeCsvValue(cols[1]);
    const volume = parseFloat(cols[2]);
    const abv = parseFloat(cols[3]);
    // Convert date from string -> Date
    const date = new Date(cols[4]);

    if (!isNaN(id) && name && !isNaN(volume) && !isNaN(abv)) {
      drinks.push({
        id,
        name,
        volume,
        abv,
        date,
      });
    }
  }
  return drinks;
}

/**
 * Basic function to unescape quotes for CSV values if you used quotes in the export.
 * For a robust solution, use a proven CSV parser library.
 */
function unescapeCsvValue(val: string): string {
  let trimmed = val.trim();
  // Remove leading/trailing quotes
  if (trimmed.startsWith('"') && trimmed.endsWith('"')) {
    trimmed = trimmed.slice(1, -1);
  }
  // Replace doubled quotes with single quotes
  return trimmed.replace(/""/g, '"');
}
