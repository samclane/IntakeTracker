// src/components/VolumeUnitSelect.tsx
import React, { FC } from "react";
import {
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  SelectChangeEvent,
} from "@mui/material";
import convert from "convert-units";

/** Props to control the unit dropdown */
interface VolumeUnitSelectProps {
  value: string;
  onChange: (unit: string) => void;
  label?: string;
  style?: React.CSSProperties;
  width?: number | string;
}

/** A reusable dropdown for volume units (ml, oz, tsp, Tbs, etc.) */
const VolumeUnitSelect: FC<VolumeUnitSelectProps> = ({
  value,
  onChange,
  label = "Unit",
  style,
  width = 120,
}) => {
  // Convert-units can list possible volume units
  const volumeUnits = convert().possibilities("volume");

  // Sort them alphabetically so the list is consistent
  volumeUnits.sort((a, b) =>
    a.localeCompare(b, undefined, { sensitivity: "base" })
  );

  // Handler for MUI Select
  const handleChange = (event: SelectChangeEvent) => {
    onChange(event.target.value as string);
  };

  return (
    <FormControl style={{ width, ...style }}>
      <InputLabel id="volume-unit-select-label">{label}</InputLabel>
      <Select
        labelId="volume-unit-select-label"
        label={label}
        value={value}
        onChange={handleChange}
      >
        {volumeUnits.map((unit) => (
          <MenuItem key={unit} value={unit}>
            {unit}
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  );
};

export default VolumeUnitSelect;
