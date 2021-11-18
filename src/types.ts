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

export type Account = {
  kind: "google",
  name: string,
  image: string
}

export type Food = {
  code: string,
  name: string,
  company: string,
  calories: number,
  proteins: number,
  fats: number,
  carbs: number
}

export type Mode = "fitness" | "food"
