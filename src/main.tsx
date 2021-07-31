import React from 'react'
import ReactDOM from 'react-dom'
import App from './App'
import GApi from "./gapi"
import Db from "./db"

// this is for dev
(window as any).GAPI = GApi;

// this is for dev
(window as any).DB = Db

ReactDOM.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
  document.getElementById('root')
)
