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

interface MultiDayLogProps {
  drinks: Drink[];
  onDelete: (id: number) => void;
  startDate?: string; // 'YYYY-MM-DD'
  endDate?: string; // 'YYYY-MM-DD'
}

const MultiDayLog: FC<MultiDayLogProps> = ({
  drinks,
  onDelete,
  startDate,
  endDate,
}) => {
  // 1) Group by date
  const grouped = groupDrinksDaily(drinks);

  // 2) Sort dates if you want them in ascending or descending order
  const allDates = Object.keys(grouped).sort(); // ascending order

  // If we have optional filters, we can slice the array of dates accordingly
  const filteredDates = allDates.filter((dateStr) => {
    if (startDate && dateStr < startDate) return false;
    if (endDate && dateStr > endDate) return false;
    return true;
  });

  // Compute grand total across all displayed days
  let grandTotalAlcohol = 0;

  return (
    <Box>
      <Typography variant="h6" gutterBottom>
        Multi-Day Log
      </Typography>

      {filteredDates.length === 0 ? (
        <Typography variant="body1" sx={{ fontStyle: "italic" }}>
          No drinks logged in this date range.
        </Typography>
      ) : (
        filteredDates.map((dateStr) => {
          const dayDrinks = grouped[dateStr] || [];

          // Summation of total pure alcohol in ml for this day
          const totalAlcoholMl = dayDrinks.reduce((acc, drink) => {
            return acc + drink.volume * (drink.abv / 100);
          }, 0);

          // Accumulate into grand total
          grandTotalAlcohol += totalAlcoholMl;

          return (
            <Paper sx={{ p: 2, mb: 3 }} elevation={3} key={dateStr}>
              <Typography variant="subtitle1" gutterBottom>
                Date: {dateStr}
              </Typography>

              {dayDrinks.length === 0 ? (
                <Typography variant="body1" sx={{ fontStyle: "italic" }}>
                  No drinks logged for {dateStr}.
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
                      {dayDrinks.map((drink) => {
                        const pureAlc = (
                          drink.volume *
                          (drink.abv / 100)
                        ).toFixed(2);
                        return (
                          <TableRow key={drink.id}>
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
                  Day Total Pure Alcohol (ml): {totalAlcoholMl.toFixed(2)}
                </Typography>
              </Box>
            </Paper>
          );
        })
      )}

      {/* GRAND TOTAL ACROSS ALL DAYS IN THE RANGE */}
      {filteredDates.length > 0 && (
        <Paper sx={{ p: 2 }} elevation={3}>
          <Typography variant="body1" fontWeight="bold">
            Grand Total (ml): {grandTotalAlcohol.toFixed(2)}
          </Typography>
        </Paper>
      )}
    </Box>
  );
};

export default MultiDayLog;
