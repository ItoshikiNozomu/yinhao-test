export type QueryResultData = {
  qq: string
  name: string
  qlogo: string
}

const Results = (props: { data: QueryResultData[] }) => {
  return (
    <div className="query-result-box">
      {props.data.length === 0 && <p className="empty-tip">无结果</p>}
      {props.data.length > 0 &&
        props.data.map((e) => (
          <div className="result-item-wrapper" key={e.qq}>
            <img src={e.qlogo} alt="qlogo" className="item-img" />
            <div>
              <div>{e.name}&nbsp;</div>
              <div>{e.qq}</div>
            </div>
          </div>
        ))}
    </div>
  )
}

export default Results
