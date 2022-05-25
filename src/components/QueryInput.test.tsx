import React from "react"
import { fireEvent, render, screen } from "@testing-library/react"
import QueryInput from "./QueryInput"
import { wait } from "@testing-library/user-event/dist/utils"
import { act } from "react-dom/test-utils"
import userEvent from "@testing-library/user-event"
// import { QueryResultData } from "./Results"
// import userEvent from "@testing-library/user-event"

const mockFetch = (mockedData: any,timeout=10) => {
  // @ts-ignore
  global.fetch = jest.fn(() =>
    Promise.resolve({
      json: async () => {
        await wait(timeout)
        return Promise.resolve(mockedData)
      },
    })
  )
}

test("works fine", async () => {
  const onChange = jest.fn()
  //   jest.mock("https://api.uomg.com/api/qq.info")
  render(<QueryInput onChange={onChange}></QueryInput>)
  const input = screen.getByTestId<HTMLInputElement>("input")
  expect(input?.type).toBe("number")
  expect(screen.queryByTestId("clear")).not.toBeVisible()
  expect(screen.queryByTestId("spin")).toBe(null)
  expect(onChange).toHaveBeenCalledTimes(0)

  fireEvent.change(input, { target: { value: "23" } })
  expect(input.value).toBe("23")
  expect(onChange).toHaveBeenCalledTimes(0)

  fireEvent.change(input, { target: { value: "01234" } })
  expect(input.value).toBe("01234")
  expect(onChange).toHaveBeenCalledTimes(0)

  const mockedData = {
    code: 1,
    qq: "1111",
    qlogo: "http://a.v.c",
    name: "nnnnn",
  }

  mockFetch(mockedData)

  fireEvent.change(input, { target: { value: "7745" } })

  expect(input.value).toBe("7745")
  expect(onChange).toHaveBeenCalledTimes(0)

  await wait(300)
  fireEvent.change(input, { target: { value: "77455" } })
  await wait(300)
  fireEvent.change(input, { target: { value: "774556" } })

  expect(await screen.findByTestId("spin")).toBeInTheDocument()
  await wait(800)
  expect(screen.queryByTestId("clear")).toBeVisible()

  expect(onChange).toHaveBeenCalledTimes(1)
  expect(onChange).toHaveBeenLastCalledWith([mockedData])

  fireEvent.click(screen.getByTestId("clear"))
  expect(onChange).toHaveBeenLastCalledWith([])
  expect(screen.queryByTestId("clear")).not.toBeVisible()

  expect(input.value).toBe('')

  const errData = {
    code:2,
    msg:"something wrong"
  }
  mockFetch(errData)
  fireEvent.change(input, { target: { value: "774556" } })
  await wait(800)
  expect(onChange).toHaveBeenLastCalledWith([],errData.msg)

})

export {}
