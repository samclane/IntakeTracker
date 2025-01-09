import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";

const rootElement = document.getElementById("root")!;
const root = ReactDOM.createRoot(rootElement);

root.render(
  <LocalizationProvider dateAdapter={AdapterDayjs}>
    <React.StrictMode>
      <App />
    </React.StrictMode>
  </LocalizationProvider>
);
