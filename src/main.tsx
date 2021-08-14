import "./index.css"
import React from 'react'
import ReactDOM from 'react-dom'
import App from './App'
import GApi from "./gapi"
import Db from "./db"
import { HashRouter as Router } from "react-router-dom"

// this is for dev
(window as any).GAPI = GApi;

// this is for dev
(window as any).DB = Db

ReactDOM.render(
  <React.StrictMode>
    <Router>
      <App />
    </Router>
  </React.StrictMode>,
  document.getElementById('root')
)
