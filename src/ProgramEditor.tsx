import React, {
  Dispatch,
  SetStateAction,
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";
import ReactFlow, {
  FlowElement,
  Handle,
  NodeProps,
  Position,
  addEdge,
  Elements,
  Edge,
} from "react-flow-renderer";
import { Flex } from "./ui";

const AddNode = (props: NodeProps) => {
  return (
    <div className="p-2 bg-blue-100">
      <Handle
        type="target"
        id="x"
        style={{ top: 10 }}
        position={Position.Left}
      />
      <Handle
        type="target"
        id="y"
        style={{ top: 30 }}
        position={Position.Left}
      />
      <div>Add</div>
      <span>{props.data.x + props.data.y}</span>
    </div>
  );
};

const EffectNode = (props: NodeProps) => {
  const dependencies = props.data.inputs.map((input: any) => props.data[input.id])
  const inputs = props.data.inputs || []

  return (
    <div className="p-2 bg-blue-100">
      {inputs.map((input: any, idx: number) => (
        <Handle
          key={idx}
          type="target"
          id={input.id}
          style={inputs.length == 1 ? {} : { top: 10 + idx * 20 }}
          position={input.position || Position.Left}
        />
      ))}
      <span>{props.data.title}</span>
    </div>
  );
};

function updateNodeData(n: FlowElement, key: string, value: any): FlowElement {
  return {
    ...n,
    data: {
      ...n.data,
      [key]: value,
    },
  };
}

const InputNode = (props: NodeProps) => {
  const [value, setValue] = useState(props.data.defaultValue || "");

  return (
    <div className="p-2 border flex flex-col bg-white">
      <span className="self-center">{props.data.title}</span>
      <input
        className="bg-gray-100 px-2"
        onChange={(ev) => setValue(ev.target.value)}
        value={value}
      />
      <Handle
        type="source"
        position={Position.Right}
      />
    </div>
  );
};

const nodeTypes = {
  Input: InputNode,
  Effect: EffectNode,
  Add: AddNode,
};

export default function ProgramEditor() {
  const [elements, setElements] = useState<Elements>([]);

  return (
    <Flex column className="h-full w-full">
      <Flex className="px-2 py-1">
        <div className="px-2 py-1 bg-gray-100 cursor-pointer" onClick={() => {
          setElements([
            ...elements,
            {
              id: elements.length.toString(),
              type: "Input",
              data: { title: "Input", setElements },
              position: { x: 200, y: 200 }
            }
          ])
        }}>
          Input
        </div>
        <div className="ml-2 px-2 py-1 bg-gray-100 cursor-pointer" onClick={() => {
          setElements([
            ...elements,
            {
              id: elements.length.toString(),
              type: "Effect",
              data: { 
                title: "console.log",
                inputs: [{ id: "value" }],
                callback: (inputs: any) => {
                  console.log(inputs[0])
                }
              },
              position: { x: 200, y: 200 }
            }
          ])
        }}>
          console.log
        </div>
        <div onClick={() => {
          
        }} className="ml-auto px-2 py-1 bg-gray-100 cursor-pointer">
          execute
        </div>
      </Flex>
      <ReactFlow
        paneMoveable
        elements={elements}
        onConnect={(params) => {
          setElements((els) => addEdge(params, els));
        }}
        nodeTypes={nodeTypes}
      />
    </Flex>
  );
}
