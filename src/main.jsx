import React from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter as Router } from "react-router-dom";
import { UserProvider } from "./contexts/userContext";
import { PositionProvider } from "./contexts/PositionContext";
import App from "./App";

// Get the root DOM element where the app will be mounted
const container = document.getElementById("root");

// Create a root instance using createRoot from ReactDOM
const root = createRoot(container);

// Render the application
root.render(
  <UserProvider>
    <PositionProvider>
      <Router>
        <App />
      </Router>
    </PositionProvider>
  </UserProvider>
);
