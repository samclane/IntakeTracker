import React, { FC, useState, useEffect } from "react";
import { Box, TextField } from "@mui/material";
import convert, { Unit } from "convert-units";
import VolumeUnitSelect from "./VolumeUnitSelect";

interface MixedDrinkCalculatorProps {
  onMixedChange: (volume: number, abv: number) => void;
}

const MixedDrinkCalculator: FC<MixedDrinkCalculatorProps> = ({
  onMixedChange,
}) => {
  // Base liquor fields
  const [baseLiquorVolume, setBaseLiquorVolume] = useState("");
  const [baseLiquorUnit, setBaseLiquorUnit] = useState("ml"); // default to ml
  const [baseLiquorAbv, setBaseLiquorAbv] = useState("");

  // Total mixed volume fields
  const [totalMixedVolume, setTotalMixedVolume] = useState("");
  const [totalMixedUnit, setTotalMixedUnit] = useState("ml"); // default to ml

  useEffect(() => {
    // Parse numeric values
    const baseVol = parseFloat(baseLiquorVolume);
    const baseAbvVal = parseFloat(baseLiquorAbv);
    const totalVol = parseFloat(totalMixedVolume);

    // If missing or invalid inputs, send zeros so the parent knows data is invalid
    if (
      !baseVol ||
      !baseAbvVal ||
      !totalVol ||
      baseVol <= 0 ||
      baseAbvVal <= 0 ||
      totalVol <= 0
    ) {
      onMixedChange(0, 0);
      return;
    }

    try {
      // Convert base liquor volume to ml
      const baseVolMl = convert(baseVol)
        .from(baseLiquorUnit as Unit)
        .to("ml");
      // Convert total mixed drink volume to ml
      const totalVolMl = convert(totalVol)
        .from(totalMixedUnit as Unit)
        .to("ml");

      // ml of pure alcohol in the base liquor
      const mlOfPureAlcohol = baseVolMl * (baseAbvVal / 100);

      // final ABV = (mlOfPureAlcohol / totalVolMl) * 100
      const finalAbv = (mlOfPureAlcohol / totalVolMl) * 100;

      // Pass results back up to parent:
      // volume (in ml) and final ABV
      onMixedChange(totalVolMl, finalAbv);
    } catch (err) {
      // If conversion fails, pass zeros
      console.error("Conversion failed:", err);
      onMixedChange(0, 0);
    }
  }, [
    baseLiquorVolume,
    baseLiquorUnit,
    baseLiquorAbv,
    totalMixedVolume,
    totalMixedUnit,
    onMixedChange,
  ]);

  return (
    <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
      {/* Base Liquor Volume & Unit */}
      <Box sx={{ display: "flex", gap: 2 }}>
        <TextField
          label="Base Liquor Volume"
          variant="outlined"
          type="number"
          value={baseLiquorVolume}
          onChange={(e) => setBaseLiquorVolume(e.target.value)}
          required
          sx={{ flex: 1 }}
        />
        <VolumeUnitSelect
          value={baseLiquorUnit}
          onChange={setBaseLiquorUnit}
          label="Unit"
        />
      </Box>

      {/* Base Liquor ABV */}
      <TextField
        label="Base Liquor ABV (%)"
        variant="outlined"
        type="number"
        value={baseLiquorAbv}
        onChange={(e) => setBaseLiquorAbv(e.target.value)}
        required
      />

      {/* Total Mixed Volume & Unit */}
      <Box sx={{ display: "flex", gap: 2 }}>
        <TextField
          label="Total Mixed Volume"
          variant="outlined"
          type="number"
          value={totalMixedVolume}
          onChange={(e) => setTotalMixedVolume(e.target.value)}
          required
          sx={{ flex: 1 }}
        />
        <VolumeUnitSelect
          value={totalMixedUnit}
          onChange={setTotalMixedUnit}
          label="Unit"
        />
      </Box>
    </Box>
  );
};

export default MixedDrinkCalculator;
