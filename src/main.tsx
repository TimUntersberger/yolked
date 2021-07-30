import React from 'react'
import ReactDOM from 'react-dom'
import App from './App'
import GApi from "./gapi"

GApi.init();

window.GAPI = GApi

ReactDOM.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
  document.getElementById('root')
)
