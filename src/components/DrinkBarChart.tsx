import React, { FC } from "react";
import { Typography } from "@mui/material";
import { BarChart } from "@mui/x-charts/BarChart";
import { Drink } from "../types/Drink";
import {
  groupStackedByDrinkName,
} from "../utils/groupDrinks";

/** Props include optional date filters */
interface DrinkBarChartProps {
  drinks: Drink[];
  startDate?: string; // e.g. "2025-01-01"
  endDate?: string; // e.g. "2025-01-31"
}

const DrinkBarChart: FC<DrinkBarChartProps> = ({
  drinks,
  startDate,
  endDate,
}) => {
  // Group the data by date & drink name (stacked format)
  const { data, drinkNames } = groupStackedByDrinkName(drinks);

  if (data.length === 0) {
    return (
      <Typography variant="body1" sx={{ fontStyle: "italic" }}>
        No drinks logged.
      </Typography>
    );
  }

  // Filter the data array by the date string in each row
  const filteredData = data.filter((row) => {
    // row.date is a string like "2025-01-01"
    const dateStr = String(row.date);
    if (startDate && dateStr < startDate) return false;
    if (endDate && dateStr > endDate) return false;
    return true;
  });

  if (filteredData.length === 0) {
    return (
      <Typography variant="body1" sx={{ fontStyle: "italic" }}>
        No drinks in the selected date range.
      </Typography>
    );
  }

  // Build one stacked series entry for each drink name
  const series = drinkNames.map((name) => ({
    dataKey: name,
    label: name,
    stack: "total", // same stack => stacked bars
  }));

  return (
    <BarChart
      xAxis={[{ dataKey: "date", scaleType: "band", label: "Date" }]}
      yAxis={[{ scaleType: "linear", label: "Pure Alcohol (ml)" }]}
      series={series}
      /**
       * As of MUI X Charts v6,
       * pass your data in "dataset" or "datasets"
       */
      dataset={filteredData}
      borderRadius={10}
      height={300}
    />
  );
};

export default DrinkBarChart;
