import React from 'react'
import { useHistory } from 'react-router-dom'

export function Flex(props: any) {
  let style: any = {
    display: "flex"
  }

  if (props.inline) {
    style.display = "inline-flex"
  }

  if (props.column) {
    style.flexDirection = "column"
  }

  if (props.centerVertical) {
    style.alignItems = "center"
  }

  if (props.centerHorizontal) {
    style.justifyContent = "center"
  }

  return (<div {...props} style={Object.assign(style, props.style || {})}>{props.children}</div>)
}

export function Grid(props: any) {
  let style: any = {
    display: "grid"
  }

  if (props.columns) {
    style.gridTemplateColumns = props.columns
  }

  if (props.centerItemsHorizontal) {
    style.justifyItems = "center"
  }

  return (<div {...props} style={Object.assign(style, props.style || {})}>{props.children}</div>)
}

export function RouterLink(props: any) {
  const history = useHistory()
  return <span onClick={() => {
    history.push(props.to)
  }}>{props.children}</span>
}

export function Button(props: any) {
  return <button className="px-2 py-1 bg-none border cursor-pointer hover:bg-gray-200 border-black">
    {props.children}
  </button>
}

