import { useEffect, useState, useCallback } from "react"

export interface RouteHook {
  path: string
  go: (next: string) => void
}

export function useRoute(): RouteHook {
  const [path, setPath] = useState(window.location.pathname)

  useEffect(() => {
    const update = () => setPath(window.location.pathname)
    window.addEventListener("popstate", update)
    return () => window.removeEventListener("popstate", update)
  }, [])

  const go = useCallback((next: string) => {
    window.history.pushState({}, "", next)
    setPath(next)
    window.scrollTo({ top: 0, behavior: "smooth" })
  }, [])

  return { path, go }
}

export default useRoute
