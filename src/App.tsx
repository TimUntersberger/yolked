import React, { useEffect, useState } from 'react'
import {
  HashRouter as Router,
  Switch,
  Route
} from "react-router-dom";
import { BiDumbbell, BiHistory, BiSpreadsheet, BiRun, BiPlus, BiUser } from "react-icons/bi"
import { IoFastFoodOutline } from "react-icons/io5"
import { Flex, Grid, Button } from "./ui"
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

  const bottomBarItems = [
    {
      name: "PROFILE",
      icon: BiUser,
      handler: () => {
        console.log("profile")
      }
    },
    {
      name: "EXERCISES",
      icon: BiDumbbell,
      handler: () => {
        console.log("exercises")
      }
    },
    {
      name: "WORKOUT",
      icon: BiPlus,
      handler: () => {
        console.log("workout")
      }
    },
    {
      name: "HISTORY",
      icon: BiHistory,
      handler: () => {
        console.log("history")
      }
    },
    {
      name: "FOOD",
      icon: IoFastFoodOutline,
      handler: () => {
        console.log("food")
      }
    },
  ]

  const authBtn = signedIn
    ? <Button onClick={() => GApi.sign_out()}>sign out</Button>
    : <Button onClick={() => GApi.sign_in()}>sign in</Button>

  return (
    <Router>
      <Flex column className="h-full">
        <Flex centerVertical className="p-2 bg-gray-100 h-12">
          <span className="text-md">Yolked</span>
          <Flex centerVertical className="ml-auto">
            <div className="mr-2">
              {signedIn && profile && <Flex centerVertical>
                <img src={profile.image} className="mr-1 rounded-full h-8"></img>
                <span>{profile.name}</span>
              </Flex>}
            </div>
            {authBtn}
          </Flex>
        </Flex>
        <Flex className="p-1">
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
        </Flex>
        <Flex centerHorizontal className="bg-gray-100 mt-auto">
          {
            bottomBarItems.map(i => {
              return <Grid centerItemsHorizontal columns="repeat(auto-fill, minmax(100px, auto))" className="text-t p-2 cursor-pointer hover:bg-gray-200" onClick={i.handler}>
                <i.icon className="text-2xl"></i.icon>
                {i.name}
              </Grid>
            })
          }
        </Flex>
      </Flex>
    </Router>
  )
}

export default App
