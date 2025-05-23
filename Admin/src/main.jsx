import { BrowserRouter } from "react-router-dom";
import { createRoot } from "react-dom/client";
// In main.jsx or App.jsx
import 'leaflet/dist/leaflet.css';

import "./index.css";
import App from "./App.jsx";

createRoot(document.getElementById("root")).render(
  <BrowserRouter>
    <App />
  </BrowserRouter>
);
