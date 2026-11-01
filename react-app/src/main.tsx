// WHAT: Imports React's development checking tool.
// WHY: Helps identify problems during development.
// WHEN: Usually at the root of a React application.
import { StrictMode } from "react";

// WHAT: Imports React DOM's root creation function.
// WHY: Connects React to the HTML page.
// WHEN: When starting a browser-based React application.
import { createRoot } from "react-dom/client";

// WHAT: Imports the main App component.
// WHY: App contains the application's interface.
// WHEN: At the entry point of our application.
import App from "./App";

// WHAT: Imports global CSS.
// WHY: Applies common styles to the entire website.
// WHEN: At application startup.
import "./index.css";

// WHAT: Find the HTML root element.
// WHY: React needs a target element.
const rootElement = document.getElementById("root");

// WHAT: Check if the root element exists.
// WHY: Prevent unclear errors if index.html is incorrect.
if (!rootElement) {
  throw new Error("Root element was not found.");
}

// WHAT: Start rendering the React application.
// WHY: Display App inside the HTML root element.
createRoot(rootElement).render(
  <StrictMode>
    <App />
  </StrictMode>
);