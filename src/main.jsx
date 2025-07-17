// src/main.jsx
import { StrictMode, useState } from "react";
import { createRoot } from "react-dom/client";
import { MantineProvider } from "@mantine/core";
import "./index.css";
import App from "./App.jsx";
import "@mantine/core/styles.css";
import "@mantine/carousel/styles.css";
import { ClerkProvider } from "@clerk/react-router";
import { BrowserRouter } from "react-router-dom";
import { APIProvider } from "@vis.gl/react-google-maps";

const PUBLISHABLE_KEY = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY;
const GOOGLE_MAPS_API_KEY = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;

if (!PUBLISHABLE_KEY) {
  throw new Error("Add your Clerk Publishable Key to the .env file");
}

function Main() {
  const [isMapsApiLoaded, setIsMapsApiLoaded] = useState(false);

  return (
    <StrictMode>
      <BrowserRouter>
        <ClerkProvider publishableKey={PUBLISHABLE_KEY}>
          <APIProvider
            apiKey={GOOGLE_MAPS_API_KEY}
            libraries={["places"]}
            onLoad={() => {
              console.log(
                "Google Maps API loaded"
              );
              setIsMapsApiLoaded(true);
            }}
          >
            <MantineProvider withGlobalStyles withNormalizeCSS>
              <App isMapsApiLoaded={isMapsApiLoaded}/>
            </MantineProvider>
          </APIProvider>
        </ClerkProvider>
      </BrowserRouter>
    </StrictMode>
  );
}

createRoot(document.getElementById("root")).render(<Main />);
