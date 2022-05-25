import { useState, useEffect } from "react"
import useDebounce from "../hooks/useDebounce"
import { QueryResultData } from "./Results"

async function fetchWithTimeout(
  resource: RequestInfo,
  init?: (RequestInit & { timeout: number }) | undefined
) {
  const timeout = init?.timeout ?? 10000

  const controller = new AbortController()
  const id = setTimeout(() => controller.abort(), timeout)
  const response = await fetch(resource, {
    ...init,
    signal: controller.signal,
  })
  clearTimeout(id)
  return response
}

export type OnQueryInputChangeFn = (
  data: QueryResultData[],
  err?: string
) => void
const LoadingSpin = () => {
  return (
    <div className="lds-ring" data-testid="spin" style={{
        position:'absolute',
        right:0,
        bottom:'3px'
    }}>
      <div></div>
      <div></div>
      <div></div>
      <div></div>
    </div>
  )
}

const QueryInput = (props: { onChange: OnQueryInputChangeFn }) => {
  const [inputValue, setInputValue] = useState("")
  const [isFetching, setIsFetching] = useState(false)
  const qqReg = /^[1-9][0-9]{4,10}$/gim
  // const [isFetching, setIsFetching] = useState(false)
  const debouncedQuery = useDebounce(
    async (v) => {
      if (qqReg.test(v)) {
        setIsFetching(true)
        let ret
        try {
          ret = await fetchWithTimeout(
            `https://api.uomg.com/api/qq.info?qq=${v}`
          ).then((r) => r.json())
        } catch (e) {
          props.onChange([], String(e))
        }

        setIsFetching(false)

        if (ret.code === 1) {
          props.onChange([ret])
        } else {
          props.onChange([], ret.msg)
        }
      }
    },
    500,
    [props.onChange]
  )
  const onClickClear = () => {
    if (isFetching || !inputValue) return
    setInputValue("")
    props.onChange([])
  }
  useEffect(() => {
    debouncedQuery(inputValue)
  }, [inputValue])
  return (
    <div className="input-wrapper">
      <input
        data-testid="input"
        type="number"
        value={inputValue}
        onChange={(e) => {
          setInputValue(e.target.value)
        }}
      />
      <i
        data-testid="clear"
        style={{ visibility: isFetching || !inputValue ? "hidden" : "visible" }}
        className="click-to-clear-input"
        onClick={onClickClear}
      >
        ×
      </i>
      {isFetching && <LoadingSpin></LoadingSpin>}
    </div>
  )
}

export default QueryInput
