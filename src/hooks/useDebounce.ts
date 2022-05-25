import { useRef, useEffect, useCallback } from "react"

export default function useDebounce<T extends (...args: any[]) => any>(
  fn: T,
  delay: number = 300,
  dep: any[] = []
) {
  const { current } = useRef<any>({ fn, timer: null })
  useEffect(
    function () {
      current.fn = fn
    },
    [fn]
  )

  return useCallback(function (...args: any) {
    if (current.timer) {
      clearTimeout(current.timer)
    }
    current.timer = setTimeout(() => {
      current.fn(...args)
    }, delay)
  }, dep)
}
