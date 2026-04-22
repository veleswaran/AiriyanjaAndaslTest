import React from "react";

// // Import Bootstrap's CSS
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap-icons/font/bootstrap-icons.css'

// Import Bootstrsap's JS (optional)
import 'bootstrap';
import "react-bootstrap-icons";

import { createRoot } from "react-dom/client";
import { App } from "./app";

function init() {
    const body = document.querySelector('body');
    const root = createRoot(body);
    root.render(React.createElement(App));
}

if (document.readyState === 'loading') {
    document.addEventListener("DOMContentLoaded", init);
} else {
    init();
}
