export type Set = {
  weight: string;
  reps: string;
};

export type ActiveExercise = {
  id: number;
  name: string;
  sets: Set[];
};

export type Profile = {
  image: string;
  name: string;
};

export type Workout = {
  id: number;
  startTime: number;
  endTime: number;
  exercises: ActiveExercise[];
};

export type Exercise = {
  id: number;
  name: string;
};
