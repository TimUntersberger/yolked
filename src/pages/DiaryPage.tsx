import React, { useEffect, useState } from "react";
import BarCodeScanner from "../components/BarCodeScanner";
import { useIndexedDatabase } from "../hooks";
import { TiCancel, TiTick } from "react-icons/ti";
import { Food } from "../types";
import { Flex, Input } from "../ui";
import { Dialog } from "@headlessui/react";

function FoodDetails(props: {
  food: any
}) {
  return (
    <div>
      {JSON.stringify(props.food)}
    </div>
  );
}

function EditFoodDialog(props: {
  code: string,
  open: boolean,
  onSave: (food: Food) => void,
  onCancel?: () => void
}) {
  const [name, setName] = useState<string | undefined>();
  const [company, setCompany] = useState<string | undefined>();
  const [proteins, setProteins] = useState<number | undefined>();
  const [fats, setFats] = useState<number | undefined>();
  const [carbs, setCarbs] = useState<number | undefined>();

  return (
    <Dialog
      open={props.open}
      onClose={props.onCancel || (() => { })}
      className="fixed z-10 inset-0 overflow-y-auto"
    >
      <Dialog.Overlay className="fixed inset-0 opacity-30 bg-black min-h-screen min-w-full" />
      <Flex centerVertical centerHorizontal className="min-h-screen">
        <Flex
          column
          style={{ height: "200px" }}
          className="z-10 bg-white border rounded-lg max-w-sm w-full mx-5 p-5 mt-5 mb-10"
        >
          <Flex>
            <Flex column>
              <span>Food</span>
              <span className="mt-2">Company</span>
            </Flex>
            <Flex column className="ml-10">
              <Input
                onChange={setName}
                initialValue={""}
              />
              <Input
                className="mt-2"
                onChange={setCompany}
                initialValue={""}
              />
            </Flex>
          </Flex>
          <Flex className="mx-auto mt-2">
            <Flex column>
              <span className="text-center">Protein</span>
              <Input
                type="number"
                className="w-12"
                onChange={setProteins}
                initialValue={0}
              />
            </Flex>
            <Flex column className="ml-2">
              <span className="text-center">Fat</span>
              <Input
                type="number"
                className="w-12"
                onChange={setFats}
                initialValue={0}
              />
            </Flex>
            <Flex column className="ml-2">
              <span className="text-center">Carbs</span>
              <Input
                type="number"
                className="w-12"
                onChange={setCarbs}
                initialValue={0}
              />
            </Flex>
          </Flex>
          <Flex className="mt-5">
            <TiCancel
              className="px-2 text-4xl cursor-pointer text-red-500 rounded-full border-red-500"
              onClick={() => props.onCancel && props.onCancel()}
            />
            <TiTick
              className="ml-auto px-2 text-4xl cursor-pointer text-green-500 rounded-full border-green-500"
              onClick={() => props.onSave({
                code: props.code,
                name: name!,
                company: company!,
                calories: proteins! * 4 + carbs! * 4 + fats! * 9,
                proteins: proteins!,
                fats: fats!,
                carbs: carbs!,
              })}
            />
          </Flex>
        </Flex>
      </Flex>
    </Dialog>
  )
}

export default function() {
  const [scanning, setScanning] = useState(false);
  const [requestEntry, setRequestEntry] = useState(false);
  const [scannedCode, setScannedCode] = useState<any | undefined>();
  const [foods, setFoods] = useState<Food[]>([]);
  const idb = useIndexedDatabase();

  useEffect(() => {
    if (scannedCode) {
      idb
        .foods
        .get(scannedCode.codeResult.code)
        .then(food => {
          if (food) {
            setFoods([...foods, food])
          } else {
            setRequestEntry(true)
          }
        })
    }
  }, [scannedCode])

  if (scanning) {
    return <BarCodeScanner onDetected={res => {
      setScannedCode(res)
      setScanning(false)
    }} />
  }

  return (
    <>
      <EditFoodDialog
        open={requestEntry}
        code={scannedCode?.codeResult?.code}
        onSave={food => {
          setFoods([...foods, food])
          idb
            .foods
            .add(food)
            .catch(console.error)
          setRequestEntry(false);
        }}
        onCancel={() => setRequestEntry(false)}
      />
      <Flex column>
        <button className="border px-2" onClick={() => setScanning(true)}>Add food</button>
        {
          foods.map((food: Food) => (
            <span>{food.name} {food.calories}</span>
          ))
        }
        <span>Calories: {foods.map((food: Food) => food.calories).reduce((sum, x) => sum + x, 0)}</span>
      </Flex>
    </>
  )
}
