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

function Container(props: any) {
  return (
    <Flex className="p-5 h-full overflow-y-scroll">
      {props.children}
    </Flex>
  )
}

function FitnessSwitch() {
  const idb = useIndexedDatabase();
  const history = useHistory();

  return (
    <>
      <Container>
        <Switch>
          <Route exact path="/fitness/active">
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
          <Route exact path="/fitness/profile">
            <ProfilePage />
          </Route>
          <Route exact path="/fitness/programs">
            <TableView
              title="Programs"
              tableName="programs"
              getKey={(x: any) => x.id}
              getDisplayValue={(x: any) => x.name}
            ></TableView>
          </Route>
          <Route exact path="/fitness/exercises">
            <TableView
              title="Exercises"
              tableName="exercises"
              getKey={(x: any) => x.id}
              getDisplayValue={(x: any) => x.name}
            ></TableView>
          </Route>
          <Route exact path="/fitness/history">
            <WorkoutHistoryPage />
          </Route>
        </Switch>
      </Container>
      <BottomBar mode="fitness" />
    </>
  )
}

function FoodSwitch() {
  return (
  <>
    <Container>
      <Switch>
      </Switch>
      </Container>
      <BottomBar mode="food" />
    </>
  )
}

function App() {
  const [initialized, setInitialized] = useState(false);
  const idb = useIndexedDatabase();

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
        <Switch>
          <Route path="/fitness">
            <FitnessSwitch />
          </Route>
          <Route path="/food">
            <FoodSwitch />
          </Route>
        </Switch>
      </Flex>
    </AccountProvider>
  );
}

export default App;
