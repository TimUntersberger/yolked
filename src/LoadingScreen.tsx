import React from "react";
import { Flex } from "./ui";
import Spinner from "./Spinner";

export type Props = { message: string }
export default (props: Props) => {
  return (
    <Flex className="h-full" column centerVertical centerHorizontal>
      <Spinner height={64} width={64} color="#333333" className="mb-2" />
      {props.message}
    </Flex>
  );
};
