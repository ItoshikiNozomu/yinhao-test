import React from "react"
import { render, screen } from "@testing-library/react"
import Results, { QueryResultData } from "./Results"

test("works fine", () => {
  render(<Results data={[]}></Results>)
  const emptyTip = screen.getByText("无结果")
  expect(emptyTip.classList.contains("empty-tip")).toBe(true)
  expect(screen.queryByAltText("qlogo")).toBe(null)
})

test("works fine1", () => {
  const data: QueryResultData[] = [
    { qq: "123456", name: "qqUser", qlogo: "https://some-img.com/img1" },
  ]
  render(<Results data={data}></Results>)

  const emptyTip = screen.queryByText("无结果")

  expect(emptyTip).toBe(null)
  expect(screen.queryByAltText<HTMLImageElement>("qlogo")?.src).toBe(
    "https://some-img.com/img1"
  )
  expect(screen.queryByText("123456")?.tagName).toBe("DIV")
  expect(screen.queryByText("qqUser")?.tagName).toBe("DIV")
})

export {}
