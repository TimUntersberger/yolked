import React from "react";
import { useHistory } from "react-router-dom";

export function Flex(props: any) {
  let style: any = props.style || {}

  style.display = props.inline ? "inline-flex" : "flex"

  if (props.column) {
    style.flexDirection = "column";
  }

  if (props.centerVertical) {
    if (props.column) {
      style.justifyContent = "center";
    } else {
      style.alignItems = "center";
    }
  }

  if (props.centerHorizontal) {
    if (props.column) {
      style.alignItems = "center";
    } else {
      style.justifyContent = "center";
    }
  }

  return (
    <div
      className={props.className}
      style={style}
    >
      {props.children}
    </div>
  );
}

export function Grid({ style, columns, centerItemsHorizontal, ...props }: any) {
  style = style || {}
  style.display = "grid"

  if (columns) {
    style.gridTemplateColumns = columns;
  }

  if (centerItemsHorizontal) {
    style.justifyItems = "center";
  }

  return (
    <div
      style={style}
      {...props}
    >
      {props.children}
    </div>
  );
}

export function RouterLink(props: any) {
  const history = useHistory();
  return (
    <span
      onClick={() => {
        history.push(props.to);
      }}
    >
      {props.children}
    </span>
  );
}

export function Button({ className, borderless, padding, ...props }: any) {
  className = `bg-none cursor-pointer hover:bg-gray-200 ${className}`
  className += " " + (padding ?? "px-2 py-1")

  if (!borderless) {
    className += " border border-black"
  }

  return (
    <button
      {...props}
      className={className}
    >
      {props.children}
    </button>
  );
}
