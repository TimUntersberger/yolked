import React, { useState } from "react";
import { useForceUpdate } from "../hooks";
import { Button, Flex } from "../ui";
import { Set } from "../types";

export default function(props: {
  number: number;
  set: Set;
  onRemoveRequest: () => void;
}): JSX.Element {
  const forceUpdate = useForceUpdate();
  const [showOptions, setShowOptions] = useState(false);
  const menuItems = [
    {
      name: "Remove Set",
      color: "red-600",
      handler: props.onRemoveRequest,
    },
  ];

  return (
    <Flex column className="w-full">
      <Flex
        className="w-full mt-2"
        onClick={() => setShowOptions(!showOptions)}
      >
        <span className="bg-gray-100 w-6 text-center rounded-md mr-auto cursor-pointer">
          {props.number}
        </span>
        <input
          type="number"
          onClick={(e) => e.stopPropagation()}
          onChange={(e) => {
            props.set.weight = e.target.value;
            forceUpdate();
          }}
          value={props.set.weight}
          className="bg-gray-100 w-12 text-center rounded-md"
        />
        <span className="mx-2">x</span>
        <input
          onClick={(e) => e.stopPropagation()}
          type="number"
          onChange={(e) => {
            props.set.reps = e.target.value;
            forceUpdate();
          }}
          value={props.set.reps}
          className="bg-gray-100 w-12 text-center rounded-md"
        />
      </Flex>

      {showOptions && (
        <Flex centerHorizontal>
          {menuItems.map((i, idx) => (
            <Button key={idx} borderless onClick={i.handler} className={`text-${i.color}`}>
              {i.name}
            </Button>
          ))}
        </Flex>
      )}
    </Flex>
  );
}
