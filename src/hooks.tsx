import { useState, useCallback } from "react";
import { GdriveDatabase, IndexedDatabase } from "./db";

export const useConst: <T>(value: () => T) => T = (value) => useState(value)[0];

export function useForceUpdate() {
  const [, setTick] = useState(0);
  const update = useCallback(() => {
    setTick(tick => tick + 1);
  }, [])
  return update;
}

const idb = new IndexedDatabase({
  name: "YolkedDb",
  version: 8,
  tables: [
    {
      name: "exercises",
      autoIncrement: true
    },
    {
      name: "workouts",
      autoIncrement: true
    },
    {
      name: "programs",
      autoIncrement: true
    },
  ]
});

const drive = new GdriveDatabase(["exercises", "workouts", "programs"]);

export function useIndexedDatabase(): IndexedDatabase {
  return idb
}

export function useGdriveDatabase(): GdriveDatabase {
  return drive
}
