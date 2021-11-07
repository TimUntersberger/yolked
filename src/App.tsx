import React, { useEffect, useState } from "react";
import {
  Switch,
  Route,
  useHistory,
} from "react-router-dom";
import { Flex, Button } from "./ui";
import { useGdriveDatabase, useIndexedDatabase } from "./hooks";
import GApi from "./gapi";
import LoadingScreen from "./LoadingScreen";
import AppScreen from "./AppScreen";
import { Profile } from "./types";
import ProfilePage from "./pages/ProfilePage";
import ActiveWorkoutPage from "./pages/ActiveWorkoutPage";
import BottomBar from "./components/BottomBar";
import WorkoutHistoryPage from "./pages/WorkoutHistoryPage";

function TableView(props: any) {
  const [data, setData] = useState<any[]>([]);
  const idb = useIndexedDatabase();

  useEffect(() => {
    (idb as any)[props.tableName].toArray().then(setData);
  }, [props.tableName]);

  return (
    <div>
      <h2>{props.title}</h2>
      {data.map((x) => (
        <p key={props.getId(x)}>{props.getDisplayValue(x)}</p>
      ))}
    </div>
  );
}

function user_to_profile(user?: gapi.auth2.GoogleUser): Profile | null {
  if (user) {
    const profile = user.getBasicProfile();

    if (profile) {
      return {
        name: profile.getName(),
        image: profile.getImageUrl(),
      };
    }
  }

  return null;
}

function App() {
  const [signedIn, setSignedIn] = useState(GApi.signed_in);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [initialized, setInitialized] = useState(false);
  const [signingIn, setSigningIn] = useState(false);
  const gdriveDatabase = useGdriveDatabase();
  const idb = useIndexedDatabase();
  const history = useHistory();

  useEffect(() => {
    GApi.load().then(async () => {
      await idb.open().catch(x => alert("Failed to open IndexedDatabase: " + JSON.stringify(x)));
      console.log("GAPI loaded");
      await GApi.init().catch(x => alert("Failed to init GApi: " + JSON.stringify(x)));
      console.log("GAPI initialized");
      const auth = gapi.auth2.getAuthInstance();
      setProfile(user_to_profile(auth.currentUser.get()));
      auth.currentUser.listen((user) => {
        console.log(user);
        setProfile(user_to_profile(user));
      });
      setInitialized(true);
    });

    GApi.set_event_handler((event) => {
      console.log("new event: " + event);
      setSignedIn(GApi.signed_in);
    });
  }, []);

  useEffect(() => {
    if (signedIn) {
      gdriveDatabase.init().catch(x => alert("Failed to init GoogleDriveDatabase: " + JSON.stringify(x)));
    }
  }, [signedIn])

  if (!initialized) {
    return <AppScreen />;
  }

  if (signingIn) {
    return <LoadingScreen message="Signing in" />;
  }

  if (!signedIn || !profile) {
    return (
      <Flex className="h-full" column centerVertical centerHorizontal>
        <Button
          onClick={() => {
            setSigningIn(true);
            GApi.sign_in()
              ?.then(() => {
                setSigningIn(false);
              })
              .catch(() => {
                setSigningIn(false);
              });
          }}
        >
          Sign in using Google
        </Button>
      </Flex>
    );
  }

  return (
    <Flex column className="h-full">
      <Flex className="p-5 h-full overflow-y-scroll">
        <Switch>
          <Route exact path="/active">
            <ActiveWorkoutPage
              onFinish={(startTime, endTime, exercises) => {
                idb
                  .workouts
                  .add({
                    startTime,
                    endTime,
                    exercises,
                  })
                  .then(() => {
                    history.push("history");
                  });
              }}
              onCancel={() => {
                history.push("history");
              }}
            />
          </Route>
          <Route exact path="/profile">
            <ProfilePage profile={profile}/>
          </Route>
          <Route exact path="/programs">
            <TableView 
              title="Programs" 
              tableName="programs" 
              getKey={(x: any) => x.id} 
              getDisplayValue={(x: any) => x.name}
            ></TableView>
          </Route>
          <Route exact path="/exercises">
            <TableView 
              title="Exercises" 
              tableName="exercises" 
              getKey={(x: any) => x.id} 
              getDisplayValue={(x: any) => x.name}
            ></TableView>
          </Route>
          <Route exact path="/history">
            <WorkoutHistoryPage />
          </Route>
        </Switch>
      </Flex>
      <BottomBar />
    </Flex>
  );
}

export default App;
