import React, { useEffect, useState } from "react";
import { useIndexedDatabase } from "../hooks";
import { Workout } from "../types";
import { Flex } from "../ui";

function WorkoutView(props: { workout: Workout }) {
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

export default function() {
  const [workouts, setWorkouts] = useState<Workout[]>([]);
  const idb = useIndexedDatabase();

  useEffect(() => {
    idb
      .workouts
      .toArray()
      .then(setWorkouts);
  }, []);

  return (
    <Flex column className="w-full">
      <p className="text-xl">Workout History</p>
      <Flex column className="w-full">
        {workouts.map((w) => (
          <WorkoutView key={w.id} workout={w} />
        ))}
      </Flex>
    </Flex>
  );
}
