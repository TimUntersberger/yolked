import React, { useEffect, useState } from "react";
import ActiveExerciseDialog from "../components/ActiveExerciseDialog";
import ExerciseDialog from "../components/ExerciseDialog";
import { ActiveExercise } from "../types";
import { Button, Flex } from "../ui";

export default function(props: {
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

  useEffect(() => {
    localStorage.setItem(
      localStorageId,
      JSON.stringify({
        startTime,
        activeExercises,
      })
    );
  }, [done, activeExercises]);

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
        <ActiveExerciseDialog
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
            localStorage.removeItem(localStorageId);
            console.log("canceled")
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
