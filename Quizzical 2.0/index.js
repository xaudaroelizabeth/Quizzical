import App from "./App"
import React from "react"
import ReactDOM from "react-dom/client"

// Grab the root div from your HTML
const rootElement = document.getElementById("root");

// Create a React root and render the App component
const root = ReactDOM.createRoot(rootElement);

root.render(<App/>)