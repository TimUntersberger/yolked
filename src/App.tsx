import React, { useState } from 'react'
import * as UI from "./ui"
import GApi from "./gapi"

function App() {
  const [signedIn, setSignedIn] = useState(GApi.signed_in)
  const [initialized, setInitialized] = useState(GApi.initialized)

  GApi.set_event_handler(event => {
    console.log("new event: " + event)
    setInitialized(GApi.initialized)
    setSignedIn(GApi.signed_in)
  })

  return (
    <div className="App">
      <p>
        Initialized: {"" + initialized}
      </p>
      <p>
        Signed in: {"" + signedIn}
      </p>
      <UI.Button disabled={signedIn} onClick={() => GApi.sign_in()}>sign in</UI.Button>
      <UI.Button disabled={!signedIn} onClick={() => GApi.sign_out()}>sign out</UI.Button>
    </div>
  )
}

export default App
