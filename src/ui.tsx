import React from 'react'
import { Link, useHistory } from 'react-router-dom'
import styled from "styled-components"

export function Flex(props: any) {
  let style: any = {
    display: "flex"
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


  return (<div style={Object.assign(style, props.style || {})}>{props.children}</div>)
}

export function RouterLink(props: any) {
  const history = useHistory()
  return <span onClick={() => {
    history.push(props.to)
  }}>{props.children}</span>
}

export const Button = styled.button`
  padding: 5px 10px;
  background: none;
  border: 1px solid black;

  &:hover {
    background: #eeeeee;
    cursor: pointer;
  }
`

export const Topbar = styled.div`
  display: flex;
  background: #eeeeee;
  padding: 10px 20px;
`

export const TopbarTitle = styled.span`
  font-size: 1.5rem
`

export const TopbarProfileImage = styled.img`
  border-radius: 20px
`

export const AppContainer = styled.div`
  display: flex;
  height: 100%;
  flex-direction: column;
`

export const Bottombar = styled.div`
  display: flex;
  background: #eeeeee;
  justify-content: center;
  margin-top: auto;
`

export const BottombarIcon = styled.div`
  display: flex;
  align-items: center;
  flex-direction: column;
  font-size: 0.6rem;
  width: 100px;
  padding: 10px;

  & > svg {
    font-size: 2rem;
  }

  &:hover {
    cursor: pointer;
    background: #dddddd;
  }
`
