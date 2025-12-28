import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";
import { Provider } from "react-redux"; // New line
import { store } from "./store"; // New line

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    {/* The Provider gives the whole app access to Redux */}
    <Provider store={store}>
      <App />
    </Provider>
  </React.StrictMode>
);
