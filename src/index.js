import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom"; // Added for future routing support
import "./index.css";
import App from "./App";

// Create the root element
const root = ReactDOM.createRoot(document.getElementById("root"));

root.render(
    <React.StrictMode>
        <BrowserRouter>
            <App />
        </BrowserRouter>
    </React.StrictMode>
);

// Optional: Measure performance in your app
// Learn more: https://bit.ly/CRA-vitals
// Uncomment the next line to enable performance monitoring
// import reportWebVitals from './reportWebVitals';
// reportWebVitals(console.log);
