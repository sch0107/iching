import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./i18n.js";
import IChing from "./iching.jsx";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <IChing />
  </StrictMode>
);
