import React, { FC } from "react";
import { Drink } from "../types/Drink";

import {
  Paper,
  Typography,
  Box,
} from "@mui/material";

import { groupDrinksDaily } from "../utils/groupDrinks";
import DrinkTable from "./DrinkTable";

interface DailyLogProps {
  drinks: Drink[];
  onDelete: (id: number) => void;
}

const DailyLog: FC<DailyLogProps> = ({ drinks, onDelete }) => {
  const [removingId, setRemovingId] = React.useState<number | null>(null);

  const handleRemove = (id: number) => {
    setRemovingId(id);
  };

  const handleAnimationEnd = (id: number) => {
    if (id === removingId) {
      onDelete(id);
      setRemovingId(null);
    }
  };

  const dailyDrinks =
    groupDrinksDaily(drinks)[new Date().toISOString().split("T")[0]] || [];
  // Summation of total pure alcohol in ml
  const totalAlcoholMl = dailyDrinks.reduce((acc, drink) => {
    return acc + drink.volume * (drink.abv / 100);
  }, 0);

  return (
    <Paper sx={{ p: 2, mb: 3 }} elevation={3}>
      <Typography variant="h6" gutterBottom>
        Today&apos;s Log
      </Typography>

      {dailyDrinks.length === 0 ? (
        <Typography variant="body1" sx={{ fontStyle: "italic" }}>
          No drinks logged yet.
        </Typography>
      ) : (
        <DrinkTable
          drinks={dailyDrinks}
          removingId={removingId}
          onRemove={handleRemove}
          onAnimationEnd={handleAnimationEnd}
        />
      )}

      <Box mt={2}>
        <Typography variant="body1" fontWeight="bold">
          Total Pure Alcohol (ml): {totalAlcoholMl.toFixed(2)}
        </Typography>
      </Box>
    </Paper>
  );
};

export default DailyLog;
