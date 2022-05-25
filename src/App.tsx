import React, { useState } from "react"

import "./App.css"

import QueryInput from "./components/QueryInput"
import Results, { QueryResultData } from "./components/Results"

function App() {
  const [queryResult, setQueryResult] = useState<QueryResultData[]>([])
  const [errTip, setErrTip] = useState<string>()
  const onQueryChange = (data: undefined | QueryResultData[], err?: string) => {
    if (data) {
      console.log(data)
      setQueryResult(data)
    }
    setErrTip(err)
  }
  return (
    <div className="app-container">
      <h4 className="title">QQ号查询</h4>
      <div className="input-box">
        QQ <QueryInput onChange={onQueryChange}></QueryInput>
      </div>

      <Results data={queryResult}></Results>
      <p className="err-tip" style={{ display: errTip ? "block" : "none" }}>
        {errTip}
      </p>
    </div>
  )
}

export default App
