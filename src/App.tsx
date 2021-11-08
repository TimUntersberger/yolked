import React, { useEffect, useState } from "react";
import {
  Switch,
  Route,
  useHistory,
} from "react-router-dom";
import { Flex } from "./ui";
import { useIndexedDatabase } from "./hooks";
import AppScreen from "./AppScreen";
import ProfilePage from "./pages/ProfilePage";
import ActiveWorkoutPage from "./pages/ActiveWorkoutPage";
import BottomBar from "./components/BottomBar";
import WorkoutHistoryPage from "./pages/WorkoutHistoryPage";
import { AccountProvider } from "./contexts/AccountContext";

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

function App() {
  const [initialized, setInitialized] = useState(false);
  const idb = useIndexedDatabase();
  const history = useHistory();

  useEffect(() => {
    idb
      .open()
      .then(() => {
        setInitialized(true);
      })
      .catch(x => alert("Failed to open IndexedDatabase: " + JSON.stringify(x)));
  }, []);

  if (!initialized) {
    return <AppScreen />;
  }

  return (
    <AccountProvider>
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
              <ProfilePage />
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
    </AccountProvider>
  );
}

export default App;
