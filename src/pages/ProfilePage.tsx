import React, { useEffect, useState } from "react";
import { useAccount, useGdriveDatabase, useIndexedDatabase } from "../hooks";
import { Button, Flex } from "../ui";
import GApi from "../gapi";
import Spinner from "../Spinner";
import { Account } from "../types";

async function signInUsingGoogle(): Promise<Account | undefined> {
  await GApi.load();
  await GApi.init().catch(x => alert("Failed to init GApi: " + JSON.stringify(x)));

  const auth = gapi.auth2.getAuthInstance()

  const googleUser = auth.currentUser.get();
  let googleUserBasicProfile = googleUser.getBasicProfile();

  if (!googleUserBasicProfile) {
    await auth.signIn()

    googleUserBasicProfile = auth.currentUser.get().getBasicProfile();
  }

  return {
    kind: "google",
    name: googleUserBasicProfile.getName(),
    image: googleUserBasicProfile.getImageUrl()
  }
}

async function signOut(account: Account) {
  if (account.kind == "google") {
    await GApi.load();
    await GApi.init().catch(x => alert("Failed to init GApi: " + JSON.stringify(x)));

    gapi.auth2.getAuthInstance().signOut()
  }
}

export default function() {
  const gdb = useGdriveDatabase();
  const idb = useIndexedDatabase();
  const [synchronizing, setSynchronizing] = useState(false);
  const [signingIn, setSigningIn] = useState(false);
  const [account, setAccount] = useAccount();

  if (!account) {
    return (
      <Flex className="h-full w-full" column centerVertical centerHorizontal>
        <Button
          onClick={() => {
            setSigningIn(true);
            signInUsingGoogle().then(account => {
              setSigningIn(false);
              setAccount(account);
            }).catch(() => {
              setSigningIn(false);
            });
          }}
        >
          {
            signingIn
              ? "Signing in..."
              : "Sign in using Google"
          }
        </Button>
      </Flex>
    )
  }

  return (
    <Flex column className="w-full" centerHorizontal>
      <img className="rounded-full mt-5" src={account.image} />
      <span className="text-2xl mt-5">{account.name}</span>
      <button className="mt-auto w-full py-2 bg-gray-300" onClick={async () => {
        setSynchronizing(true)
        await gdb.init();
        await gdb.sync(idb)
        setSynchronizing(false)
      }}>{
          synchronizing
            ? <Spinner height="24" className="mx-auto" />
            : "Synchronize"
        }</button>
      <button className="w-full mt-3 py-2 bg-gray-300" onClick={() => {
        signOut(account);
        setAccount(undefined);
      }}>
        Sign out
      </button>
    </Flex>
  )
}
