import React, { FC } from "react";
import { Drink } from "../types/Drink";

import {
  Paper,
  TableContainer,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Typography,
  IconButton,
  Box,
} from "@mui/material";

import DeleteIcon from "@mui/icons-material/Delete";
import { groupDrinksDaily } from "../utils/groupDrinks";

interface DailyLogProps {
  drinks: Drink[];
  onDelete: (id: number) => void;
}

const DailyLog: FC<DailyLogProps> = ({ drinks, onDelete }) => {
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
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Drink</TableCell>
                <TableCell>Volume (ml)</TableCell>
                <TableCell>ABV (%)</TableCell>
                <TableCell>Pure Alcohol (ml)</TableCell>
                <TableCell align="center">Actions</TableCell>
              </TableRow>
            </TableHead>

            <TableBody>
              {dailyDrinks.map((drink) => {
                const pureAlc = (drink.volume * (drink.abv / 100)).toFixed(2);
                return (
                  <TableRow key={drink.id} className="fade-in">
                    <TableCell>{drink.name}</TableCell>
                    <TableCell>{drink.volume.toFixed(2)}</TableCell>
                    <TableCell>{drink.abv}</TableCell>
                    <TableCell>{pureAlc}</TableCell>
                    <TableCell align="center">
                      <IconButton
                        color="error"
                        onClick={() => onDelete(drink.id)}
                        aria-label="delete"
                      >
                        <DeleteIcon />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </TableContainer>
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
