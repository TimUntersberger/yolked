import { Dialog } from "@headlessui/react";
import fuzzysort from "fuzzysort";
import React, { useEffect, useRef, useState } from "react";
import { useIndexedDatabase } from "../hooks";
import { Exercise } from "../types";
import { Button, Flex } from "../ui";

function NewExerciseDialog(props: {
  open: boolean;
  onConfirm: (name: string) => void;
  onCancel: () => void;
  onClose: () => void;
}) {
  const inputRef = useRef<HTMLInputElement | null>(null);
  const [name, setName] = useState("");

  return (
    <Dialog
      open={props.open}
      onClose={props.onClose}
      initialFocus={inputRef}
      className="fixed z-10 inset-0 overflow-y-auto"
    >
      <Flex centerHorizontal centerVertical className="min-h-screen">
        <Dialog.Overlay className="fixed inset-0 opacity-30 bg-black min-h-screen min-w-full" />
        <Flex
          column
          style={{ height: "140px" }}
          className="z-10 bg-white border rounded-lg max-w-sm w-full mx-5 p-3 mt-5 mb-10"
        >
          <Dialog.Title className="text-2xl">New Exercise</Dialog.Title>
          <input
            ref={inputRef}
            className="bg-gray-100 rounded mt-4 px-2 py-1"
            placeholder="Name"
            value={name}
            onChange={(ev) => setName(ev.target.value)}
          />
          <Flex className="mt-2 mx-2">
            <Button
              onClick={props.onCancel}
              borderless
              className="text-red-600"
            >
              Cancel
            </Button>
            <Button
              onClick={() => props.onConfirm(name)}
              borderless
              className="text-green-500 ml-auto"
            >
              Save
            </Button>
          </Flex>
        </Flex>
      </Flex>
    </Dialog>
  );
}

export default function(props: {
  open: boolean;
  onClose: () => void;
  onSelect: (exercise: Exercise) => void;
}) {
  const inputRef = useRef<HTMLInputElement | null>(null);
  const [filter, setFilter] = useState("");
  const [newExerciseModalOpen, setNewExerciseModalOpen] = useState(false);
  const [exercises, setExercises] = useState<Exercise[]>([]);
  const [filteredExercises, setFilteredExercises] = useState<Exercise[]>([]);
  const idb = useIndexedDatabase();

  useEffect(() => {
    idb
      .exercises
      .toArray()
      .then(setExercises);
  }, []);

  useEffect(() => {
    setFilteredExercises(
      fuzzysort
        .go<Exercise>(filter, exercises, { key: "name" })
        .map((res) => res.obj)
    );
  }, [exercises, filter]);

  return (
    <Dialog
      open={props.open}
      onClose={props.onClose}
      initialFocus={inputRef}
      className="fixed z-10 inset-0 overflow-y-auto"
    >
      <Flex centerHorizontal className="min-h-screen">
        <Dialog.Overlay className="fixed inset-0 opacity-30 bg-black min-h-screen min-w-full" />
        {newExerciseModalOpen && (
          <NewExerciseDialog
            open={newExerciseModalOpen}
            onConfirm={(name) => {
              console.log(name)
              idb.exercises.add({ name }).then((id) => {
                setExercises([
                  ...exercises,
                  {
                    id,
                    name,
                  },
                ]);
                setNewExerciseModalOpen(false);
              }).catch(x => alert(JSON.stringify(x)));
            }}
            onCancel={() => {
              setNewExerciseModalOpen(false);
            }}
            onClose={() => setNewExerciseModalOpen(false)}
          />
        )}
        {
          <Flex
            column
            style={{ height: "90vh" }}
            className="bg-white z-10 border rounded-lg max-w-sm w-full mx-2 p-3 mt-5 mb-10"
          >
            <Flex>
              <Dialog.Title className="text-2xl">Exercises</Dialog.Title>
              <button
                onClick={() => {
                  setNewExerciseModalOpen(true);
                }}
                className="ml-auto mr-2 text-blue-400"
              >
                Add
              </button>
            </Flex>
            <input
              value={filter}
              onChange={(ev) => setFilter(ev.target.value)}
              className="bg-gray-100 rounded mt-3 px-2 py-1"
              placeholder="Search"
              ref={inputRef}
            />
            <Flex column className="mt-4">
              {(filter == "" ? exercises : filteredExercises)
                .flatMap((ex, idx) => [
                  <hr key={idx + "hr"} />,
                  <span
                    onClick={() => {
                      props.onSelect(ex);
                      props.onClose();
                    }}
                    key={idx}
                    className="py-2 cursor-pointer"
                  >
                    {ex.name}
                  </span>,
                ])
                .slice(1)}
            </Flex>
          </Flex>
        }
      </Flex>
    </Dialog>
  );
}
