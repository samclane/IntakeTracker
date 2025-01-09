import { Drink } from "../types/Drink";
import dayjs from "dayjs";
import { ChartRow } from "../types/ChartRow";

function queryDrinksByDate(drinks: Drink[], dateQuery: string) {
  const grouped: Record<string, Drink[]> = {};

  drinks.forEach((drink) => {
    const dateObj =
      drink.date instanceof Date ? drink.date : new Date(drink.date);
    const dateStr = dayjs(dateObj).format(dateQuery);
    if (!grouped[dateStr]) grouped[dateStr] = [];
    grouped[dateStr].push(drink);
  });

  return grouped;
}

export function groupDrinksDaily(drinks: Drink[]): Record<string, Drink[]> {
  return queryDrinksByDate(drinks, "YYYY-MM-DD");
}

export function groupDrinksWeekly(drinks: Drink[]): Record<string, Drink[]> {
  return queryDrinksByDate(drinks, "YYYY-[W]WW");
}

export function groupDrinksMonthly(drinks: Drink[]): Record<string, Drink[]> {
  return queryDrinksByDate(drinks, "YYYY-MM");
}

export function groupStackedByDrinkName(drinks: Drink[]): {
  data: ChartRow[];
  drinkNames: string[];
} {
  // 1) Get all unique drink names
  const allNames = Array.from(new Set(drinks.map((d) => d.name)));

  // 2) Group drinks by date (YYYY-MM-DD)
  const groupedByDate = groupDrinksDaily(drinks);

  // Sort the dates so the chart is chronological
  const sortedDates = Object.keys(groupedByDate).sort();

  const rows: ChartRow[] = sortedDates.map((dateStr) => {
    const drinksOnDate = groupedByDate[dateStr];

    // Build an object like: { date: '2025-01-01', Beer: 12.4, Wine: 5.7, ... }
    const row: ChartRow = { date: dateStr };

    // Initialize each drink name to 0
    for (const name of allNames) {
      row[name] = 0;
    }

    // Sum pure alcohol for each name
    for (const d of drinksOnDate) {
      const pureAlc = d.volume * (d.abv / 100);
      row[d.name] = (row[d.name] as number) + pureAlc;
    }

    return row;
  });

  return { data: rows, drinkNames: allNames };
}
