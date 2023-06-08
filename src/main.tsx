import { render } from "solid-js/web";

import "./index.css";
import App from "./App";

const app = document.getElementById("app");

if (!app) throw new Error("No #app element found in the DOM.");

render(() => <App />, app);
