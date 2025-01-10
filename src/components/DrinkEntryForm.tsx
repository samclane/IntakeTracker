import React, { useState, FormEvent, FC, useCallback } from "react";
import { Drink, FavoriteDrink } from "../types/Drink";
import {
  Box,
  TextField,
  Button,
  Paper,
  Typography,
  FormControlLabel,
  Switch,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from "@mui/material";
import convert, { Unit } from "convert-units";

import MixedDrinkCalculator from "./MixedDrinkCalculator";
import VolumeUnitSelect from "./VolumeUnitSelect"; // <-- import the new component
import { getFavoriteDrinks$, addFavoriteDrink } from "../store/drinksStore";

interface DrinkEntryFormProps {
  onAddDrink: (drink: Drink) => void;
}

const DrinkEntryForm: FC<DrinkEntryFormProps> = ({ onAddDrink }) => {
  const [name, setName] = useState("");
  const [volume, setVolume] = useState("");
  const [unit, setUnit] = useState("ml"); // default to ml
  const [abv, setAbv] = useState("");
  const [quantity, setQuantity] = useState("1");

  // Mixed drink toggle
  const [isMixedDrink, setIsMixedDrink] = useState(false);

  // store final from MixedDrinkCalculator
  const [mixedCalculatedVolume, setMixedCalculatedVolume] = useState(0);
  const [mixedCalculatedAbv, setMixedCalculatedAbv] = useState(0);

  const [favorites, setFavorites] = useState<FavoriteDrink[]>([]);

  React.useEffect(() => {
    const sub = getFavoriteDrinks$().subscribe((favs: FavoriteDrink[]) => setFavorites(favs));
    return () => sub.unsubscribe();
  }, []);

  const handleMixedChange = useCallback(
    (finalVol: number, finalAbv: number) => {
      setMixedCalculatedVolume(finalVol);
      setMixedCalculatedAbv(finalAbv);
    },
    []
  );

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    // We always need a drink name
    if (!name.trim()) return;

    let finalVol = 0;
    let finalAbv = 0;

    if (isMixedDrink) {
      // In mixed mode, we only rely on what MixedDrinkCalculator gave us
      // If it’s still zero, user might not have filled in the fields properly
      if (mixedCalculatedVolume <= 0 || mixedCalculatedAbv <= 0) {
        return;
      }

      finalVol = mixedCalculatedVolume;
      finalAbv = mixedCalculatedAbv;
    } else {
      // Normal mode

      // We need volume & abv from the text fields
      if (!volume || !abv) return;

      const rawVolume = parseFloat(volume);
      if (isNaN(rawVolume) || rawVolume <= 0) return;

      const parsedAbv = parseFloat(abv);
      if (isNaN(parsedAbv) || parsedAbv < 0) return;

      // Convert the typed volume to ml
      let volumeInMl = rawVolume;
      try {
        volumeInMl = convert(rawVolume)
          .from(unit as Unit)
          .to("ml");
      } catch (err) {
        console.error("Conversion failed:", err);
        return;
      }

      // Basic checks
      if (volumeInMl <= 0 || parsedAbv <= 0) return;

      finalVol = volumeInMl;
      finalAbv = parsedAbv;
    }

    const q = parseInt(quantity) || 1;
    for (let i = 0; i < q; i++) {
      // Build the new drink object
      const newDrink: Drink = {
        id: Date.now() + i,
        name,
        volume: finalVol,
        abv: finalAbv,
        date: new Date(),
      };

      onAddDrink(newDrink);
    }

    // Reset form fields
    setName("");
    setVolume("");
    setAbv("");
    setUnit("ml");
    setIsMixedDrink(false);
    setMixedCalculatedVolume(0);
    setMixedCalculatedAbv(0);
    setQuantity("1");
  };

  const handleSaveAsFavorite = () => {
    if (!name.trim() || !abv || !volume) return;
    const rawVolume = parseFloat(volume);
    const parsedAbv = parseFloat(abv);
    if (isNaN(rawVolume) || rawVolume <= 0 || isNaN(parsedAbv) || parsedAbv <= 0) return;
    addFavoriteDrink({ name, volume: rawVolume, abv: parsedAbv });
  };

  const handleFavoriteSelect = (fav: FavoriteDrink) => {
    setName(fav.name);
    setVolume(String(fav.volume));
    setAbv(String(fav.abv));
  };

  return (
    <Paper sx={{ p: 2, mb: 3 }} elevation={3}>
      <Typography variant="h6" gutterBottom>
        Log a New Drink
      </Typography>

      {favorites.length > 0 && (
        <Box sx={{ mb: 2, display: "flex", flexDirection: "column", gap: 2 }}>
          <FormControl>
            <InputLabel id="load-saved-drink">Load a Saved Drink</InputLabel>
            <Select
              labelId="load-saved-drink"
              id="load-saved-drink-select"
              value={""}
              label="Load a Saved Drink"
              onChange={(e) => {
                const fav = favorites[parseInt(e.target.value)];
                handleFavoriteSelect(fav);
              }}
            >
              {favorites.map((f, idx) => (
                <MenuItem key={idx} value={idx}>
                  {f.name} ({f.volume}ml @ {f.abv}%)
                </MenuItem>
              ))}

            </Select>
          </FormControl>
        </Box>

      )}

      <Box
        component="form"
        onSubmit={handleSubmit}
        noValidate
        sx={{ display: "flex", flexDirection: "column", gap: 2 }}
      >
        {/* DRINK NAME */}
        <TextField
          label="Drink Name"
          variant="outlined"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />

        <FormControlLabel
          control={
            <Switch
              checked={isMixedDrink}
              onChange={(e) => setIsMixedDrink(e.target.checked)}
              color="primary"
            />
          }
          label="Mixed Drink?"
        />

        {isMixedDrink ? (
          <MixedDrinkCalculator onMixedChange={handleMixedChange} />
        ) : (
          <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
            <Box sx={{ display: "flex", gap: 2 }}>
              <TextField
                label="Volume"
                variant="outlined"
                type="number"
                value={volume}
                onChange={(e) => setVolume(e.target.value)}
                required
                sx={{ flex: 1 }}
              />

              {/* REUSABLE UNIT SELECT */}
              <VolumeUnitSelect
                label="Unit"
                value={unit}
                onChange={(newUnit) => setUnit(newUnit)}
              />
            </Box>

            <TextField
              label="ABV (%)"
              variant="outlined"
              type="number"
              value={abv}
              onChange={(e) => setAbv(e.target.value)}
              required
            />
          </Box>
        )}

        <TextField
          label="Quantity"
          variant="outlined"
          type="number"
          value={quantity}
          onChange={(e) => setQuantity(e.target.value)}
          required
        />

        {/* SUBMIT */}
        <Button type="submit" variant="contained" color="primary">
          Add Drink
        </Button>

        <Button onClick={handleSaveAsFavorite} variant="outlined">
          Save As Favorite
        </Button>
      </Box>
    </Paper>
  );
};

export default DrinkEntryForm;
