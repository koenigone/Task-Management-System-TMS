import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { ColorModeScript } from "@chakra-ui/react";
import App from "./App.tsx";
import theme from "./theme.tsx";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <BrowserRouter>
      <ColorModeScript initialColorMode={theme.config.initialColorMode} />
      <App />
    </BrowserRouter>
  </StrictMode>
);