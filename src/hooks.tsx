import { useState, useCallback } from "react";

export const useConst: <T>(value: () => T) => T = (value) => useState(value)[0];

export function useForceUpdate() {
  const [, setTick] = useState(0);
  const update = useCallback(() => {
      setTick(tick => tick + 1);
      }, [])
  return update;
}
