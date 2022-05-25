import React, { createContext, useContext, useEffect, useState } from "react"

export type RootState = { a?: string }

export const ctx = createContext<RootState>({})

export const updateRootState = (state: Partial<RootState>) => {
  const event = new CustomEvent("updateRootState", { detail: state })

  document.dispatchEvent(event)
}

export const MyProvider = ({ children }: { children: React.ReactNode }) => {
  const [state, set] = useState<RootState>({})
  useEffect(() => {
    const onUpdate = (e:any) => {
      set(prev=>({...prev,...e.detail}))
    }
    document.addEventListener("updateRootState", onUpdate)
    return () => document.removeEventListener("updateRootState", onUpdate)
  }, [])
  return <ctx.Provider value={state}>{children}</ctx.Provider>
}
