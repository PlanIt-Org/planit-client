import { useState } from "react";
import "./App.css";
import TripPlanning from "./pages/TripPlanning";
import { Box } from "@mui/material";

function App() {
  return (
    <>
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "100vh",
          width: "100%",
        }}
      >
        <TripPlanning />
      </Box>
    </>
  );
}

export default App;
