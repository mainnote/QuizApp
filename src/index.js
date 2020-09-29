import React from "react";
import ReactDOM from "react-dom";
import WebFont from 'webfontloader';
import "./index.css";
import App from "./App";
import * as serviceWorker from "./serviceWorker";
import "jquery/dist/jquery.min.js";
import "bootstrap/dist/js/bootstrap.min.js";
import "bootstrap/dist/css/bootstrap.min.css";
import 'font-awesome/css/font-awesome.min.css';
import './i18n';

WebFont.load({
    google: {
      families: ['Ma Shan Zheng:300,400,700', 'sans-serif']
    }
  });

ReactDOM.render(<App />, document.getElementById("root"));

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
