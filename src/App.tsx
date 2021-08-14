import React, { useEffect, useRef, useState } from "react";
import {
  HashRouter as Router,
  Switch,
  Route,
  useHistory,
} from "react-router-dom";
import { BiHistory, BiPlus, BiDotsVerticalRounded } from "react-icons/bi";
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

type Workout = {
  id: number;
  startTime: number;
  endTime: number;
  exercises: ActiveExercise[];
};

function Workout(props: { workout: Workout }) {
  const [showDetails, setShowDetails] = useState(false);

  return (
    <Flex
      onClick={() => setShowDetails(!showDetails)}
      column
      className="border w-full rounded mt-2 p-1"
    >
      <Flex className="w-full text-lg">
        <span>{new Date(props.workout.startTime).toLocaleDateString()}</span>
        <span className="ml-auto">
          {new Date(props.workout.startTime).toLocaleTimeString()}
        </span>
      </Flex>
      {showDetails && (
        <Flex column>
          {props.workout.exercises.map((e, idx) => (
            <span key={idx}>
              {e.name} {e.sets.length}
            </span>
          ))}
        </Flex>
      )}
    </Flex>
  );
}

function WorkoutHistory(props: any) {
  const [workouts, setWorkouts] = useState<Workout[]>([]);

  useEffect(() => {
    Db.idb
      .to_array("workouts")
      .then((pairs) => pairs.map((pair) => ({ id: pair[0], ...pair[1] })))
      .then(setWorkouts);
  }, []);

  return (
    <Flex column className="w-full">
      <p className="text-xl">Workout History</p>
      <Flex column className="w-full">
        {workouts.map((w) => (
          <Workout key={w.id} workout={w} />
        ))}
      </Flex>
    </Flex>
  );
}

type Exercise = {
  id: number;
  name: string;
};

function NewExerciseDialog(props: {
  open: boolean;
  onConfirm: (name: string) => void;
  onCancel: () => void;
  onClose: () => void;
}) {
  const inputRef = useRef<HTMLInputElement | null>(null);
  const [name, setName] = useState("");

  return (
    <Dialog
      open={props.open}
      onClose={props.onClose}
      initialFocus={inputRef}
      className="fixed z-10 inset-0 overflow-y-auto"
    >
      <Flex centerHorizontal centerVertical className="min-h-screen">
        <Dialog.Overlay className="fixed inset-0 opacity-30 bg-black min-h-screen min-w-full" />
        <Flex
          column
          style={{ height: "140px" }}
          className="z-10 bg-white border rounded-lg max-w-sm w-full mx-5 p-3 mt-5 mb-10"
        >
          <Dialog.Title className="text-2xl">New Exercise</Dialog.Title>
          <input
            ref={inputRef}
            className="bg-gray-100 rounded mt-4 px-2 py-1"
            placeholder="Name"
            value={name}
            onChange={(ev) => setName(ev.target.value)}
          />
          <Flex className="mt-2 mx-2">
            <Button
              onClick={props.onCancel}
              borderless
              className="text-red-600"
            >
              Cancel
            </Button>
            <Button
              onClick={() => props.onConfirm(name)}
              borderless
              className="text-green-500 ml-auto"
            >
              Save
            </Button>
          </Flex>
        </Flex>
      </Flex>
    </Dialog>
  );
}

function ExerciseDialog(props: {
  open: boolean;
  onClose: () => void;
  onSelect: (exercise: Exercise) => void;
}) {
  const inputRef = useRef<HTMLInputElement | null>(null);
  const [filter, setFilter] = useState("");
  const [newExerciseModalOpen, setNewExerciseModalOpen] = useState(false);
  const [exercises, setExercises] = useState<Exercise[]>([]);
  const [filteredExercises, setFilteredExercises] = useState<Exercise[]>([]);

  useEffect(() => {
    Db.idb
      .to_array("exercises")
      .then((pairs) => pairs.map((pair) => ({ id: pair[0], name: pair[1] })))
      .then(setExercises);
  }, []);

  useEffect(() => {
    setFilteredExercises(
      fuzzysort
        .go<Exercise>(filter, exercises, { key: "name" })
        .map((res) => res.obj)
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
        <Dialog.Overlay className="fixed inset-0 opacity-30 bg-black min-h-screen min-w-full" />
        {newExerciseModalOpen && (
          <NewExerciseDialog
            open={newExerciseModalOpen}
            onConfirm={(name) => {
              Db.idb.insert("exercises", null, name).then((id) => {
                setExercises([
                  ...exercises,
                  {
                    id,
                    name,
                  },
                ]);
                setNewExerciseModalOpen(false);
              });
            }}
            onCancel={() => {
              setNewExerciseModalOpen(false);
            }}
            onClose={() => setNewExerciseModalOpen(false)}
          />
        )}
        {
          <Flex
            column
            style={{ height: "90vh" }}
            className="bg-white z-10 border rounded-lg max-w-sm w-full mx-2 p-3 mt-5 mb-10"
          >
            <Flex>
              <Dialog.Title className="text-2xl">Exercises</Dialog.Title>
              <button
                onClick={() => {
                  setNewExerciseModalOpen(true);
                }}
                className="ml-auto mr-2 text-blue-400"
              >
                Add
              </button>
            </Flex>
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
                      props.onSelect(ex);
                      props.onClose();
                    }}
                    key={idx}
                    className="py-2 cursor-pointer"
                  >
                    {ex.name}
                  </span>,
                ])
                .slice(1)}
            </Flex>
          </Flex>
        }
      </Flex>
    </Dialog>
  );
}

type Set = {
  weight: string;
  reps: string;
};

type ActiveExercise = {
  id: number;
  name: string;
  sets: Set[];
};

function ActiveSet(props: {
  number: number;
  set: Set;
  onRemoveRequest: () => void;
}) {
  const forceUpdate = useForceUpdate();
  const [showOptions, setShowOptions] = useState(false);
  const menuItems = [
    {
      name: "Remove Set",
      color: "red-600",
      handler: props.onRemoveRequest,
    },
  ];

  return (
    <Flex column className="w-full">
      <Flex
        className="w-full mt-2"
        onClick={() => setShowOptions(!showOptions)}
      >
        <span className="bg-gray-100 w-6 text-center rounded-md mr-auto cursor-pointer">
          {props.number}
        </span>
        <input
          onClick={(e) => e.stopPropagation()}
          onChange={(e) => {
            props.set.weight = e.target.value;
            forceUpdate();
          }}
          value={props.set.weight}
          className="bg-gray-100 w-12 text-center rounded-md"
        />
        <span className="mx-2">x</span>
        <input
          onClick={(e) => e.stopPropagation()}
          onChange={(e) => {
            props.set.reps = e.target.value;
            forceUpdate();
          }}
          value={props.set.reps}
          className="bg-gray-100 w-12 text-center rounded-md"
        />
      </Flex>

      {showOptions && (
        <Flex centerHorizontal>
          {menuItems.map((i, idx) => (
            <Button key={idx} borderless onClick={i.handler} className={`text-${i.color}`}>
              {i.name}
            </Button>
          ))}
        </Flex>
      )}
    </Flex>
  );
}

function ActiveExercise(props: {
  exercise: ActiveExercise;
  onRemoveRequest: () => void;
}) {
  const forceUpdate = useForceUpdate();
  const menuItems = [
    {
      name: "Remove Exercise",
      handler: props.onRemoveRequest,
    },
  ];

  return (
    <Flex column className="w-full mt-4">
      <Flex>
        <span className="text-2xl">{props.exercise.name}</span>
        <Menu>
          <Menu.Button className="ml-auto">
            <BiDotsVerticalRounded className="text-xl"></BiDotsVerticalRounded>
          </Menu.Button>
          <Menu.Items className="absolute border bg-white right-0 mr-1 mt-2 rounded-md">
            {menuItems.map((i, idx) => {
              return (
                <Menu.Item
                  onClick={i.handler}
                  key={idx}
                  as="p"
                  className={`py-1 px-3 cursor-pointer hover:bg-gray-200`}
                >
                  {i.name}
                </Menu.Item>
              );
            })}
          </Menu.Items>
        </Menu>
      </Flex>
      <div className="w-full px-5">
        {props.exercise.sets.map((s, idx) => (
          <ActiveSet
            key={idx}
            number={idx + 1}
            set={s}
            onRemoveRequest={() => {
              props.exercise.sets.splice(idx, 1);
              forceUpdate();
            }}
          />
        ))}
        <Button
          onClick={() => {
            const prev_set =
              props.exercise.sets[props.exercise.sets.length - 1];
            props.exercise.sets.push({
              weight: prev_set.weight || "",
              reps: prev_set.reps || "",
            });
            forceUpdate();
          }}
          borderless
          padding=""
          className="bg-gray-200 w-full mt-3 rounded-md"
        >
          Add set
        </Button>
      </div>
    </Flex>
  );
}

function ActiveWorkout(props: {
  onFinish: (
    startTime: number,
    endTime: number,
    exercises: ActiveExercise[]
  ) => void;
  onCancel: () => void;
}) {
  const [startTime, setStartTime] = useState(() => Date.now());
  const [done, setDone] = useState(false);
  const [currentTime, setCurrentTime] = useState(startTime);
  const [exerciseModalOpen, setExerciseModalOpen] = useState(false);
  const [activeExercises, setActiveExercises] = useState<ActiveExercise[]>([]);

  const deltaTime = currentTime - startTime;

  // active workout
  const localStorageId = "aw";

  useEffect(() => {
    const aw = localStorage.getItem(localStorageId);

    if (aw) {
      const aw_obj = JSON.parse(aw);
      setStartTime(aw_obj.startTime);
      setActiveExercises(aw_obj.activeExercises);
    }
  }, []);

  useEffect(() => () => {
    if (!done) {
      localStorage.setItem(
        localStorageId,
        JSON.stringify({
          startTime,
          activeExercises,
        })
      );
    } else {
      localStorage.removeItem(localStorageId);
    }
  });

  useEffect(() => {
    if (done) {
      return;
    }
    const interval = setInterval(() => {
      setCurrentTime(Date.now());
    }, 1000);

    return () => {
      clearInterval(interval);
    };
  }, [done]);

  return (
    <Flex column centerHorizontal className="w-full h-full p-3">
      <ExerciseDialog
        open={exerciseModalOpen}
        onClose={() => setExerciseModalOpen(false)}
        onSelect={(ex) => {
          setActiveExercises([
            ...activeExercises,
            { id: ex.id, name: ex.name, sets: [] },
          ]);
        }}
      />
      <span className="text-lg">
        {new Date(deltaTime).toUTCString().slice(17, 26)}
      </span>
      {activeExercises.map((e, idx) => (
        <ActiveExercise
          key={idx}
          exercise={e}
          onRemoveRequest={() => {
            setActiveExercises([
              ...activeExercises.slice(0, idx),
              ...activeExercises.slice(idx + 1),
            ]);
          }}
        />
      ))}
      <Button
        onClick={() => setExerciseModalOpen(true)}
        borderless
        className="bg-blue-200 w-full mt-5"
      >
        Add exercise
      </Button>
      <Flex className="w-full mt-2">
        <Button
          onClick={() => {
            setDone(true);
            props.onCancel();
          }}
          borderless
          className="bg-red-200 w-full"
        >
          Cancel workout
        </Button>
        <Button
          onClick={() => {
            setDone(true);
            props.onFinish(startTime, currentTime, activeExercises);
          }}
          borderless
          className="bg-green-200 ml-2 w-full"
        >
          Finish workout
        </Button>
      </Flex>
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
        history.push("history");
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
  const history = useHistory();

  useEffect(() => {
    Db.init();
    GApi.load().then(async () => {
      console.log("GAPI loaded");
      await GApi.init();
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
    <Flex column className="h-full">
      <TopBar profile={profile} />
      <Flex className="p-2 h-full overflow-y-scroll">
        <Switch>
          <Route exact path="/active">
            <ActiveWorkout
              onFinish={(startTime, endTime, exercises) => {
                Db.idb
                  .insert("workouts", null, {
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
          <Route exact path="/programs">
            <TableView title="Programs" tableName="programs"></TableView>
          </Route>
          <Route exact path="/exercises">
            <TableView title="Exercises" tableName="exercises"></TableView>
          </Route>
          <Route exact path="/history">
            <WorkoutHistory />
          </Route>
        </Switch>
      </Flex>
      <BottomBar />
    </Flex>
  );
}

export default App;
