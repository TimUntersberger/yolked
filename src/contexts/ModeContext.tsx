import React, { useEffect, useState } from "react";
import { createContext } from "react";
import { Mode } from "../types";

export const ModeContext =
  createContext<[Mode, (mode: Mode) => void]>(["fitness", () => { }])

export const AccountProvider = (props: any) => {
  const [value, setValue] = useState<Mode>(() => {
    return localStorage.getItem("mode") as any
  })

  useEffect(() => {
    if (!value) {
      localStorage.removeItem("mode")
    } else {
      localStorage.setItem("mode", value)
    }
  }, [value])

  return (
    <ModeContext.Provider value={[value, setValue]}>
      {props.children}
    </ModeContext.Provider>
  )
}
