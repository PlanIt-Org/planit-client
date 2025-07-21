// src/main.jsx
import { StrictMode, useState } from "react";
import { createRoot } from "react-dom/client";
import { MantineProvider } from "@mantine/core";
import "./index.css";
import App from "./App.jsx";
import "@mantine/core/styles.css";
import "@mantine/carousel/styles.css";
import { BrowserRouter } from "react-router-dom";
import { APIProvider } from "@vis.gl/react-google-maps";

const GOOGLE_MAPS_API_KEY = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;

export function Main() {
  const [isMapsApiLoaded, setIsMapsApiLoaded] = useState(false);

  return (
    <StrictMode>
      <BrowserRouter>
        {/* CLERK WRAPPER WAS HERE*/}
        <APIProvider
          apiKey={GOOGLE_MAPS_API_KEY}
          libraries={["places", "routes"]}
          onLoad={() => {
            console.log("Google Maps API loaded");
            setIsMapsApiLoaded(true);
          }}
        >
          <MantineProvider withGlobalStyles withNormalizeCSS>
            <App isMapsApiLoaded={isMapsApiLoaded} />
          </MantineProvider>
        </APIProvider>
      </BrowserRouter>
    </StrictMode>
  );
}

createRoot(document.getElementById("root")).render(<Main />);
