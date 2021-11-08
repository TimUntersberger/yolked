import React, { useEffect, useState } from "react";
import { createContext } from "react";
import { Account } from "../types";

export const AccountContext =
  createContext<[Account | undefined, (acc: Account | undefined) => void]>([undefined, () => { }])

export const AccountProvider = (props: any) => {
  const [value, setValue] = useState<Account | undefined>(() => {
    let item = localStorage.getItem("account")

    if (item) {
      return JSON.parse(item)
    }

    return item
  })

  useEffect(() => {
    console.log("Account changed: ", value)
    if (!value) {
      localStorage.removeItem("account")
    } else {
      localStorage.setItem("account", JSON.stringify(value))
    }
  }, [value])

  return (
    <AccountContext.Provider value={[value, setValue]}>
      {props.children}
    </AccountContext.Provider>
  )
}
