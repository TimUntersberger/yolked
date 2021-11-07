import { Menu } from "@headlessui/react";
import React from "react";
import { BiDotsVerticalRounded } from "react-icons/bi";
import { useForceUpdate } from "../hooks";
import { ActiveExercise } from "../types";
import { Button, Flex } from "../ui";
import ActiveSet from "./ActiveSet";

export default function (props: {
  exercise: ActiveExercise;
  onRemoveRequest: () => void;
}) {
  const forceUpdate = useForceUpdate();
  const menuItems = [
    {
      name: "Remove Exercise",
      handler: props.onRemoveRequest,
    },
  ];

  return (
    <Flex column className="w-full mt-4">
      <Flex>
        <span className="text-2xl">{props.exercise.name}</span>
        <Menu>
          <Menu.Button className="ml-auto">
            <BiDotsVerticalRounded className="text-xl"></BiDotsVerticalRounded>
          </Menu.Button>
          <Menu.Items className="absolute border bg-white right-0 mr-1 mt-2 rounded-md">
            {menuItems.map((i, idx) => {
              return (
                <Menu.Item
                  onClick={i.handler}
                  key={idx}
                  as="p"
                  className={`py-1 px-3 cursor-pointer hover:bg-gray-200`}
                >
                  {i.name}
                </Menu.Item>
              );
            })}
          </Menu.Items>
        </Menu>
      </Flex>
      <div className="w-full px-5">
        {props.exercise.sets.map((s, idx) => (
          <ActiveSet
            key={idx}
            number={idx + 1}
            set={s}
            onRemoveRequest={() => {
              props.exercise.sets.splice(idx, 1);
              forceUpdate();
            }}
          />
        ))}
        <Button
          onClick={() => {
            const prev_set =
              props.exercise.sets[props.exercise.sets.length - 1] || {};
            props.exercise.sets.push({
              weight: prev_set.weight || "",
              reps: prev_set.reps || "",
            });
            forceUpdate();
          }}
          borderless
          padding=""
          className="bg-gray-200 w-full mt-3 rounded-md"
        >
          Add set
        </Button>
      </div>
    </Flex>
  );
}
