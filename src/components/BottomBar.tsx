import React from "react";
import { BiHistory, BiPlus, BiUser } from "react-icons/bi";
import { IoFastFoodOutline } from "react-icons/io5";
import { useHistory } from "react-router-dom";
import { Flex, Grid } from "../ui";

export default function() {
  const history = useHistory();

  const bottomBarItems = [
    {
      name: "HISTORY",
      icon: BiHistory,
      handler: () => {
        history.push("history");
        console.log("history");
      },
    },
    {
      name: "PROFILE",
      icon: BiUser,
      handler: () => {
        history.push("profile");
        console.log("profile");
      },
    },
    {
      name: "WORKOUT",
      icon: BiPlus,
      handler: () => {
        history.push("active");
        console.log("workout");
      },
    },
    {
      name: "FOOD",
      icon: IoFastFoodOutline,
      handler: () => {
        console.log("food");
      },
    },
  ];

  return (
    <Flex centerHorizontal className="bg-gray-100 mt-auto pb-5 shadow">
      {bottomBarItems.map((i, idx) => {
        return (
          <Grid
            key={idx}
            centerItemsHorizontal
            columns="repeat(auto-fill, minmax(20vw, 1fr))"
            className="text-t p-2 cursor-pointer hover:bg-gray-200"
            onClick={i.handler}
          >
            <i.icon className="text-2xl"></i.icon>
            {i.name}
          </Grid>
        );
      })}
    </Flex>
  );
}
