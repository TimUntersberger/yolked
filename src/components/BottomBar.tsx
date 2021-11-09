import React from "react";
import { BiHistory, BiPlus, BiUser, BiDumbbell, BiBarChart } from "react-icons/bi";
import { IoFastFoodOutline, IoJournalSharp } from "react-icons/io5";
import { useHistory } from "react-router-dom";
import { Mode } from "../types";
import { Flex, Grid } from "../ui";

const barItems = {
  fitness: [
    {
      name: "PROFILE",
      icon: BiUser,
      handler: (history: any) => {
        history.push("/fitness/profile");
        console.log("profile");
      },
    },
    {
      name: "HISTORY",
      icon: BiHistory,
      handler: (history: any) => {
        history.push("/fitness/history");
        console.log("history");
      },
    },
    {
      name: "WORKOUT",
      icon: BiPlus,
      handler: (history: any) => {
        history.push("/fitness/active");
        console.log("workout");
      },
    },
    {
      name: "FOOD",
      icon: IoFastFoodOutline,
      handler: (history: any) => {
        history.push("/food")
      },
    },
  ],
  food: [
    {
      name: "PROFILE",
      icon: BiUser,
      handler: (history: any) => {
        history.push("/food/profile");
        console.log("profile");
      },
    },
    {
      name: "PROGRESS",
      icon: BiBarChart,
      handler: (history: any) => {
        history.push("/food/progress")
      },
    },
    {
      name: "DIARY",
      icon: IoJournalSharp,
      handler: (history: any) => {
        history.push("/food/diary")
      },
    },
    {
      name: "FITNESS",
      icon: BiDumbbell,
      handler: (history: any) => {
        history.push("/fitness")
      },
    },
  ]
};

export default function(props: { mode: Mode }) {
  const history = useHistory();
  const items = barItems[props.mode]

  return (
    <Grid
      centerItemsHorizontal
      columns={`repeat(${items.length}, 1fr)`}
      className="bg-gray-100 mt-auto pb-5 shadow"
    >
      {items.map(i => (
        <Flex column centerHorizontal className="cursor-pointer text-t p-2 hover:bg-gray-200 w-full" onClick={() => i.handler(history)}>
          <i.icon className="text-2xl"/>
          {i.name}
        </Flex>
      ))}
    </Grid>
  );
}
