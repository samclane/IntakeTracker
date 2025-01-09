import React, { useState, useMemo, useCallback, FC, ChangeEvent } from "react";
import {
  createTheme,
  ThemeProvider,
  Theme,
  PaletteMode,
} from "@mui/material/styles";
import {
  AppBar,
  Toolbar,
  Typography,
  Container,
  Box,
  IconButton,
  Button,
  Stack,
} from "@mui/material";
import LightModeIcon from "@mui/icons-material/LightMode";
import DarkModeIcon from "@mui/icons-material/DarkMode";

import dayjs, { Dayjs } from "dayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";

import { Drink } from "./types/Drink";
import DrinkEntryForm from "./components/DrinkEntryForm";
import DailyLog from "./components/DailyLog";
import MultiDayLog from "./components/MultiDayLog";
import DrinkBarChart from "./components/DrinkBarChart";

import { exportJSON, exportCSV } from "./utils/exportUtils";
import { parseDrinksJSON, parseDrinksCSV } from "./utils/importUtils";
import "./styles.css";
import { getDrinks$, deleteDrink } from "./store/drinksStore";

const App: FC = () => {
  const [mode, setMode] = useState<PaletteMode>("light");
  const [drinks, setDrinks] = useState<Drink[]>([]);

  // Date range for MultiDayLog
  const [startDate, setStartDate] = useState<Dayjs>(dayjs("2025-01-01"));
  const [endDate, setEndDate] = useState<Dayjs>(dayjs("2025-01-31"));

  const toggleMode = useCallback(() => {
    setMode((prevMode) => (prevMode === "light" ? "dark" : "light"));
  }, []);

  const theme: Theme = useMemo(
    () =>
      createTheme({
        palette: {
          mode,
          primary: { main: "#1976d2" },
          secondary: { main: "#dc004e" },
          background: {
            default: mode === "dark" ? "#212121" : "#fafafa",
            paper: mode === "dark" ? "#1e1e1e" : "#fff",
          },
        },
        components: {
          MuiButton: {
            styleOverrides: {
              root: {
                transition: "all 0.3s ease-in-out",
              },
            },
          },
        },
      }),
    [mode]
  );

  React.useEffect(() => {
    const sub = getDrinks$().subscribe((updated) => {
      setDrinks(updated);
    });
    return () => sub.unsubscribe();
  }, []);

  const handleAddDrink = (newDrink: Drink) => {
    setDrinks((prev) => [...prev, newDrink]);
  };

  const handleDeleteDrink = (id: number) => {
    deleteDrink(id);
  };

  const handleDelete = (id: number) => {
    deleteDrink(id);
  };

  const handleExportJSON = () => exportJSON(drinks);
  const handleExportCSV = () => exportCSV(drinks);

  // File input references
  const jsonFileInputRef = React.useRef<HTMLInputElement>(null);
  const csvFileInputRef = React.useRef<HTMLInputElement>(null);

  const promptImportJSON = () => {
    if (jsonFileInputRef.current) jsonFileInputRef.current.click();
  };
  const promptImportCSV = () => {
    if (csvFileInputRef.current) csvFileInputRef.current.click();
  };

  const handleImportJSONFile = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (ev) => {
      const text = ev.target?.result;
      if (typeof text === "string") {
        const importedDrinks = parseDrinksJSON(text);
        setDrinks(importedDrinks);
      }
    };
    reader.readAsText(file);
    e.target.value = "";
  };

  const handleImportCSVFile = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (ev) => {
      const text = ev.target?.result;
      if (typeof text === "string") {
        const importedDrinks = parseDrinksCSV(text);
        setDrinks(importedDrinks);
      }
    };
    reader.readAsText(file);
    e.target.value = "";
  };

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <ThemeProvider theme={theme}>
        <Box
          sx={{
            minHeight: "100vh",
            bgcolor: "background.default",
            color: "text.primary",
          }}
        >
          <AppBar position="static">
            <Toolbar sx={{ justifyContent: "space-between" }}>
              <Typography variant="h6" component="div">
                Alcohol Tracker
              </Typography>

              <IconButton color="inherit" onClick={toggleMode}>
                {mode === "light" ? <DarkModeIcon /> : <LightModeIcon />}
              </IconButton>
            </Toolbar>
          </AppBar>

          <Container sx={{ py: 3 }}>
            <DrinkEntryForm onAddDrink={handleAddDrink} />

            <DailyLog drinks={drinks} onDelete={handleDeleteDrink} />

            {/* Date Pickers for the MultiDayLog Range */}
            <Stack direction="row" spacing={2} sx={{ mb: 2 }}>
              <DatePicker
                label="Start Date"
                value={startDate}
                onChange={(newValue) => {
                  if (newValue) setStartDate(newValue);
                }}
              />
              <DatePicker
                label="End Date"
                value={endDate}
                onChange={(newValue) => {
                  if (newValue) setEndDate(newValue);
                }}
              />
            </Stack>

            {/* MultiDayLog: pass the date range */}
            <MultiDayLog
              drinks={drinks}
              onDelete={handleDelete}
              startDate={startDate.format("YYYY-MM-DD")}
              endDate={endDate.format("YYYY-MM-DD")}
            />

            <Typography sx={{ my: 2 }} variant="h5" gutterBottom>
              Analytics
            </Typography>

            <Box sx={{ my: 2 }}>
              <Typography variant="h6">Daily View</Typography>
              <DrinkBarChart
                drinks={drinks}
                startDate={startDate.format("YYYY-MM-DD")}
                endDate={endDate.format("YYYY-MM-DD")}
              />
            </Box>

            <Stack direction="row" spacing={2} sx={{ mt: 3 }}>
              <Button variant="contained" onClick={handleExportJSON}>
                Export JSON
              </Button>
              <Button variant="contained" onClick={handleExportCSV}>
                Export CSV
              </Button>

              <Button
                variant="contained"
                color="secondary"
                onClick={promptImportJSON}
              >
                Import JSON
              </Button>
              <input
                type="file"
                accept=".json"
                ref={jsonFileInputRef}
                style={{ display: "none" }}
                onChange={handleImportJSONFile}
              />

              <Button
                variant="contained"
                color="secondary"
                onClick={promptImportCSV}
              >
                Import CSV
              </Button>
              <input
                type="file"
                accept=".csv"
                ref={csvFileInputRef}
                style={{ display: "none" }}
                onChange={handleImportCSVFile}
              />
            </Stack>
          </Container>
        </Box>
      </ThemeProvider>
    </LocalizationProvider>
  );
};

export default App;
