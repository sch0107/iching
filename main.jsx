import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import IChing from "./iching.jsx";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <IChing />
  </StrictMode>
);
