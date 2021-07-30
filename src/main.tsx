import React from 'react'
import ReactDOM from 'react-dom'
import App from './App'
import GApi from "./gapi"

GApi.init();

// this is for dev
(window as any).GAPI = GApi

ReactDOM.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
  document.getElementById('root')
)
