import React, { useEffect, useState } from "react";
import { TiTrash } from "react-icons/ti";
import { FiClock } from "react-icons/fi";
import { useIndexedDatabase } from "../hooks";
import { Workout } from "../types";
import { Flex } from "../ui";
import ConfirmationDialog from "../components/ConfirmationDialog";

const days = [
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
  "Sunday"
]

const months = [
  "January",
  "Feburary",
  "March",
  "April",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December"
]

function WorkoutView(props: {
  workout: Workout,
  onDelete: (workout: Workout) => void
}) {
  const [showDetails, setShowDetails] = useState(false);
  const date = new Date(props.workout.startTime);
  const duration = new Date(props.workout.endTime - props.workout.startTime)
  const durationHours = duration.getHours() - 1;
  const durationMinutes = duration.getMinutes()

  return (
    <Flex
      onClick={() => setShowDetails(!showDetails)}
      column
      className="border w-full rounded mt-3 p-2"
    >
      <Flex className="w-full text-lg">
        <span>{days[date.getDay() - 1]}, {date.getUTCDate()}. {months[date.getUTCMonth() - 1]}</span>
        <span className="ml-auto">
          {date.getHours().toString().padStart(2, "0")}:{date.getMinutes().toString().padStart(2, "0")}
        </span>
      </Flex>
      <Flex centerVertical className="mt-1 text-gray-800">
        <FiClock className="mr-1 text-lg" />
        <span>
          {durationHours > 0 ? <>{durationHours}h </> : <></>} {durationMinutes > 0 ? <>{durationMinutes}m</> : <></>}
        </span>
      </Flex>
      {showDetails && (
        <Flex column>
          <hr className="mt-2" />
          {props.workout.exercises.map((e, idx) => (
            <Flex column className="mt-3">
              <span className="text-lg font-bold" key={idx}>
                {e.name}
              </span>
              {e.sets.map((s, idx) => (
                <span className="text-md" key={idx}>
                  {s.weight} kg x {s.reps}
                </span>
              ))}
            </Flex>
          ))}
          <Flex className="mt-5">
            <TiTrash
              className="cursor-pointer ml-auto text-2xl text-red-500"
              onClick={() => {
                props.onDelete(props.workout)
              }}
            />
          </Flex>
        </Flex>
      )}
    </Flex>
  );
}

export default function WorkoutHistoryPage() {
  const [workouts, setWorkouts] = useState<Workout[]>([]);
  const [deleteSubject, setDeleteSubject] = useState<Workout | undefined>();
  const idb = useIndexedDatabase();

  useEffect(() => {
    idb
      .workouts
      .toArray()
      .then(setWorkouts);
  }, []);

  return (
    <Flex column className="w-full">
      <ConfirmationDialog 
        open={!!deleteSubject}
        message="Permanently delete the workout?"
        onConfirm={async () => {
          await idb.workouts.delete(deleteSubject!.id)
          setWorkouts(await idb.workouts.toArray())
          setDeleteSubject(undefined)
        }}
        onCancel={() => setDeleteSubject(undefined)}
      />
      <p className="text-xl">Workout History</p>
      <Flex column className="w-full">
        {workouts.map((w) => (
          <WorkoutView
            key={w.id}
            workout={w}
            onDelete={w => setDeleteSubject(w)}
          />
        ))}
      </Flex>
    </Flex>
  );
}
