import { Dialog } from "@headlessui/react";
import React, { useRef } from "react";
import { Button, Flex } from "../ui";

export default function ConfirmationDialog(props: {
  message: string,
  open: boolean,
  onCancel: () => void,
  onConfirm: () => void,
}) {
  const focusRef = useRef(null);

  return (
    <Dialog
      open={props.open}
      onClose={props.onCancel}
      className="fixed z-10 inset-0 overflow-y-auto"
      initialFocus={focusRef}
    >
      <Dialog.Overlay className="fixed inset-0 opacity-30 bg-black min-h-screen min-w-full" />
      <Flex centerVertical centerHorizontal className="min-h-screen">
        <Flex
          column
          className="z-10 bg-white border rounded-lg max-w-sm w-full mx-5 p-5 mt-5 mb-10"
        >
          <span className="text-xl">{props.message}</span>
          <Flex className="mt-5">
            <Button 
              padding="px-2" 
              className="ml-auto rounded border-green-500 text-green-500"
              onClick={() => props.onConfirm()}
            >Yes</Button>
            <Button 
              padding="px-2" 
              className="ml-2 rounded border-red-500 text-red-500" 
              ref={focusRef}
              onClick={() => props.onCancel()}
            >No</Button>
          </Flex>
        </Flex>
      </Flex>
    </Dialog>
  )
}
