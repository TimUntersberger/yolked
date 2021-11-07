import React, { useState } from "react";
import { useGdriveDatabase, useIndexedDatabase } from "../hooks";
import { Flex } from "../ui";
import GApi from "../gapi";
import { Profile } from "../types";
import Spinner from "../Spinner";

export default function(props: {
  profile: Profile
}) {
  const gdb = useGdriveDatabase();
  const idb = useIndexedDatabase();
  const [synchronizing, setSynchronizing] = useState(false);

  return (
    <Flex column className="w-full" centerHorizontal>
      <img className="rounded-full mt-5" src={props.profile.image} />
      <span className="text-2xl mt-5">{props.profile.name}</span>
      <button className="mt-auto w-full py-2 bg-gray-300" onClick={async () => {
        setSynchronizing(true)
        await gdb.sync(idb)
        setSynchronizing(false)
      }}>{
          synchronizing
            ? <Spinner height="24" className="mx-auto" />
            : "Synchronize"
        }</button>
      <button className="w-full mt-3 py-2 bg-gray-300" onClick={() => {
        GApi.sign_out();
      }}>Sign out</button>
    </Flex>
  )
}
