import React, { useEffect, useRef, useState } from "react";
import {
  HashRouter as Router,
  Switch,
  Route,
  useHistory,
} from "react-router-dom";
import { BiHistory, BiPlus } from "react-icons/bi";
import { IoFastFoodOutline } from "react-icons/io5";
import { Flex, Grid, Button } from "./ui";
import { useConst, useForceUpdate } from "./hooks";
import GApi from "./gapi";
import Db from "./db";
import LoadingScreen from "./LoadingScreen";
import AppScreen from "./AppScreen";
import { Dialog, Menu } from "@headlessui/react";
import ProgramEditor from "./ProgramEditor";
import fuzzysort from "fuzzysort";

function TableView(props: any) {
  const [data, setData] = useState<[any, any][]>([]);

  useEffect(() => {
    Db.idb.to_array(props.tableName).then(setData);
  }, [props.tableName]);

  return (
    <div>
      <h2>{props.title}</h2>
      {data.map((x) => (
        <p key={x[0]}>{x[1]}</p>
      ))}
    </div>
  );
}

function msToTime(s: number) {
  function pad(n: number, z?: number) {
    z = z || 2;
    return ("00" + n).slice(-z);
  }

  var ms = s % 1000;
  s = (s - ms) / 1000;
  var secs = s % 60;
  s = (s - secs) / 60;
  var mins = s % 60;
  var hrs = (s - mins) / 60;

  return pad(hrs) + ":" + pad(mins) + ":" + pad(secs);
}

function ExerciseDialog(props: any) {
  const inputRef = useRef<HTMLInputElement | null>(null);
  const [filter, setFilter] = useState("");
  const [exercises, setExercises] = useState([
    "Bench Press",
    "Close Grip Bench Press",
    "Squat",
    "Deadlift",
  ]);
  const [filteredExercises, setFilteredExercises] = useState<string[]>([]);

  useEffect(() => {
    setFilteredExercises(
      fuzzysort.go(filter, exercises).map((res) => res.target)
    );
  }, [exercises, filter]);

  return (
    <Dialog
      open={props.open}
      onClose={props.onClose}
      initialFocus={inputRef}
      className="fixed z-10 inset-0 overflow-y-auto"
    >
      <Flex centerHorizontal className="min-h-screen">
        <Flex
          column
          style={{ height: "90vh" }}
          className="bg-white border rounded-lg max-w-sm w-full mx-2 p-3 mt-5 mb-10"
        >
          <Dialog.Title className="text-2xl">Exercises</Dialog.Title>
          <input
            value={filter}
            onChange={(ev) => setFilter(ev.target.value)}
            className="bg-gray-100 rounded mt-3 px-2 py-1"
            placeholder="Search"
            ref={inputRef}
          />
          <Flex column className="mt-4">
            {(filter == "" ? exercises : filteredExercises)
              .flatMap((ex, idx) => [
                <hr key={idx + "hr"} />,
                <span
                  onClick={() => {
                    props.onSelect(ex)
                    props.onClose()
                  }}
                  key={idx}
                  className="py-2 cursor-pointer"
                >
                  {ex}
                </span>,
              ])
              .slice(1)}
          </Flex>
        </Flex>
      </Flex>
    </Dialog>
  );
}

type Set = {
  weight: string;
  reps: string;
};

type ActiveExercise = {
  name: string;
  sets: Set[];
};

function ActiveWorkout() {
  const startTime = useConst(() => Date.now());
  const [currentTime, setCurrentTime] = useState(startTime);
  const forceUpdate = useForceUpdate();
  const [exerciseModalOpen, setExerciseModalOpen] = useState(false);
  const [activeExercises, setActiveExercises] = useState<ActiveExercise[]>([]);

  const deltaTime = currentTime - startTime;

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTime(Date.now());
    }, 1000);

    return () => {
      clearInterval(interval);
    };
  }, []);

  return (
    <Flex column centerHorizontal className="w-full h-full p-3">
      <ExerciseDialog
        open={exerciseModalOpen}
        onClose={() => setExerciseModalOpen(false)}
        onSelect={(ex: string) => {
          setActiveExercises([...activeExercises, { name: ex, sets: [] }])
        }}
      />
      <span className="text-lg">{msToTime(deltaTime)}</span>
      {activeExercises.map((e, idx) => (
        <Flex key={idx} column className="w-full mt-4">
          <span className="text-2xl">{e.name}</span>
          <div className="w-full px-5">
            {e.sets.map((s, idx) => (
              <Flex key={idx} className="w-full mt-2">
                <span className="bg-gray-100 w-6 text-center rounded-md mr-auto cursor-pointer">
                  {idx + 1}
                </span>
                <input
                  onChange={(e) => {
                    s.weight = e.target.value;
                    forceUpdate();
                  }}
                  value={s.weight}
                  className="bg-gray-100 w-8 text-center rounded-md"
                />
                <span className="mx-2">x</span>
                <input
                  onChange={(e) => {
                    s.reps = e.target.value;
                    forceUpdate();
                  }}
                  value={s.reps}
                  className="bg-gray-100 w-8 text-center rounded-md"
                />
              </Flex>
            ))}
            <Button
              onClick={() => {
                e.sets.push({
                  weight: "",
                  reps: "",
                });
                forceUpdate();
              }}
              borderless
              padding=""
              className="bg-gray-100 w-full mt-3 rounded-md"
            >
              Add set
            </Button>
          </div>
        </Flex>
      ))}
      <Button onClick={() => setExerciseModalOpen(true)} borderless className="bg-gray-100 w-full mt-5">
        Add exercise
      </Button>
    </Flex>
  );
}

type Profile = {
  image: string;
  name: string;
};

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

function TopBar(props: any) {
  const profileMenuItems = [
    {
      name: "Synchronizing...",
    },
    {
      name: "Exercises",
      handler: () => {},
    },
    {
      name: "Sign Out",
      handler: () => {
        GApi.sign_out();
      },
    },
  ];

  return (
    <Flex centerVertical className="p-2 bg-gray-100 h-12">
      <span className="text-xl">Yolked</span>
      <Flex centerVertical className="ml-auto">
        <div className="mr-2">
          {props.profile && (
            <Menu>
              <Menu.Button className="flex">
                <img
                  src={props.profile.image}
                  className="mr-1 rounded-full h-8"
                ></img>
              </Menu.Button>
              <Menu.Items className="absolute bg-gray-100 right-0 mr-1 mt-2 rounded-md py-2">
                <Menu.Item
                  as="p"
                  className={`py-1 px-3 text-gray-500 flex items-center`}
                >
                  <img
                    src={props.profile.image}
                    className="mr-2 rounded-full h-7"
                  ></img>
                  <span className="text-lg">{props.profile.name}</span>
                </Menu.Item>
                <hr className="border-gray-300" />
                {profileMenuItems.map((i, idx) => {
                  return (
                    <Menu.Item
                      onClick={i.handler}
                      key={idx}
                      as="p"
                      className={`py-1 px-3 ${
                        i.handler
                          ? "cursor-pointer hover:bg-gray-200"
                          : "text-gray-500"
                      }`}
                    >
                      {i.name}
                    </Menu.Item>
                  );
                })}
              </Menu.Items>
            </Menu>
          )}
        </div>
      </Flex>
    </Flex>
  );
}

function BottomBar() {
  const history = useHistory();

  const bottomBarItems = [
    {
      name: "HISTORY",
      icon: BiHistory,
      handler: () => {
        console.log("history");
      },
    },
    {
      name: "WORKOUT",
      icon: BiPlus,
      handler: () => {
        history.push("active");
        console.log("workout");
      },
    },
    {
      name: "FOOD",
      icon: IoFastFoodOutline,
      handler: () => {
        console.log("food");
      },
    },
  ];

  return (
    <Flex centerHorizontal className="bg-gray-100 mt-auto shadow">
      {bottomBarItems.map((i, idx) => {
        return (
          <Grid
            key={idx}
            centerItemsHorizontal
            columns="repeat(auto-fill, minmax(28vw, 1fr))"
            className="text-t p-2 cursor-pointer hover:bg-gray-200"
            onClick={i.handler}
          >
            <i.icon className="text-2xl"></i.icon>
            {i.name}
          </Grid>
        );
      })}
    </Flex>
  );
}

function App() {
  const [signedIn, setSignedIn] = useState(GApi.signed_in);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [initialized, setInitialized] = useState(false);
  const [signingIn, setSigningIn] = useState(false);

  useEffect(() => {
    Db.init();
    GApi.load().then(async () => {
      await GApi.init();
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

  //   if (true) {
  //     return <ProgramEditor />
  //   }

  if (!initialized) {
    return <AppScreen />;
  }

  if (signingIn) {
    return <LoadingScreen message="Signing in" />;
  }

  if (!signedIn) {
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
    <Router>
      <Flex column className="h-full">
        <TopBar profile={profile} />
        <Flex className="p-1 h-full overflow-y-scroll">
          <Switch>
            <Route exact path="/active">
              <ActiveWorkout />
            </Route>
            <Route exact path="/programs">
              <TableView title="Programs" tableName="programs"></TableView>
            </Route>
            <Route exact path="/exercises">
              <TableView title="Exercises" tableName="exercises"></TableView>
            </Route>
            <Route exact path="/history">
              <TableView
                title="Workout History"
                tableName="workouts"
              ></TableView>
            </Route>
          </Switch>
        </Flex>
        <BottomBar />
      </Flex>
    </Router>
  );
}

export default App;
