import React, { useEffect, useState } from 'react'
import {
  HashRouter as Router,
  Switch,
  Route
} from "react-router-dom";
import { BiDumbbell, BiHistory, BiSpreadsheet, BiRun } from "react-icons/bi"
import * as UI from "./ui"
import GApi from "./gapi"
import Db from "./db"

function TableView(props: any) {
  const [data, setData] = useState<[any, any][]>([])

  useEffect(() => {
    Db.idb.to_array(props.tableName).then(setData)
  }, [props.tableName])

  return (
    <div>
      <h2>{props.title}</h2>
      {
        data.map(x => <p key={x[0]}>{x[1]}</p>)
      }
    </div>
  )
}

type Profile = {
  image: string,
  name: string
}

function user_to_profile(user?: gapi.auth2.GoogleUser): Profile | null {
  if (user) {
    const profile = user.getBasicProfile()

    return {
      name: profile.getName(),
      image: profile.getImageUrl()
    }
  } else {
    return null
  }
}

function App() {
  const [signedIn, setSignedIn] = useState(GApi.signed_in)
  const [profile, setProfile] = useState<Profile | null>(null)
  const [initialized, setInitialized] = useState(false)

  useEffect(() => {
    Db.init()
    GApi.load().then(async () => {
      await GApi.init()
      const auth = gapi.auth2.getAuthInstance()
      setProfile(user_to_profile(auth.currentUser.get()))
      auth.currentUser.listen(user => {
        console.log(user)
        setProfile(user_to_profile(user))
      })
      setInitialized(true)
    })


    GApi.set_event_handler(event => {
      console.log("new event: " + event)
      setSignedIn(GApi.signed_in)
    })
  }, [])

  if (!initialized) {
    return <p>Loading... </p>
  }

  const authBtn = signedIn
    ? <UI.Button onClick={() => GApi.sign_out()}>sign out</UI.Button>
    : <UI.Button onClick={() => GApi.sign_in()}>sign in</UI.Button>

  return (
    <Router>
      <UI.AppContainer>
        <UI.Topbar>
          <UI.TopbarTitle>Yolked</UI.TopbarTitle>
          <UI.Flex style={{ marginLeft: "auto" }}>
            <div style={{ marginRight: "10px" }}>
              {signedIn && profile && <UI.Flex centerVertical>
                <UI.TopbarProfileImage height={28} src={profile.image} style={{ marginRight: "5px" }}></UI.TopbarProfileImage>
                <span>{profile.name}</span>
              </UI.Flex>}
            </div>
            <div>
              {authBtn}
            </div>
          </UI.Flex>
        </UI.Topbar>
        <UI.Flex style={{ padding: "5px" }}>
          <Switch>
            <Route exact path="/programs">
              <TableView title="Programs" tableName="programs"></TableView>
            </Route>
            <Route exact path="/exercises">
              <TableView title="Exercises" tableName="exercises"></TableView>
            </Route>
            <Route exact path="/history">
              <TableView title="Workout History" tableName="workouts"></TableView>
            </Route>
          </Switch>
        </UI.Flex>
        <UI.Bottombar>
          <UI.RouterLink to="programs">
            <UI.BottombarIcon>
              <BiSpreadsheet></BiSpreadsheet>
              PROGRAMS
            </UI.BottombarIcon>
          </UI.RouterLink>
          <UI.RouterLink to="exercises">
            <UI.BottombarIcon>
              <BiRun></BiRun>
              EXERCISES
            </UI.BottombarIcon>
          </UI.RouterLink>
          <UI.RouterLink to="history">
            <UI.BottombarIcon>
              <BiHistory></BiHistory>
              HISTORY
            </UI.BottombarIcon>
          </UI.RouterLink>
          <UI.BottombarIcon>
            <BiDumbbell></BiDumbbell>
            WORKOUT
          </UI.BottombarIcon>
        </UI.Bottombar>
      </UI.AppContainer>
    </Router>
  )
}

export default App
