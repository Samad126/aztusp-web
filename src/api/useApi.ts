import { useCallback, useEffect, useState } from 'react'
import { apiGet } from './client.ts'
import { clearPhoto } from './photo.ts'

// Every call scrapes the university portal live, so responses are kept for a while
// and shared between components instead of being re-fetched on each navigation.
const FRESH_MS = 5 * 60 * 1000

const cache = new Map<string, { data: unknown; at: number }>()
const inflight = new Map<string, Promise<unknown>>()

export function clearApiCache() {
  cache.clear()
  inflight.clear()
  clearPhoto()
}

export function fetchCached<T>(path: string, force = false): Promise<T> {
  const hit = cache.get(path)
  if (!force && hit && Date.now() - hit.at < FRESH_MS) return Promise.resolve(hit.data as T)

  const pending = inflight.get(path)
  if (pending) return pending as Promise<T>

  const request = apiGet<T>(path)
    .then((data) => {
      cache.set(path, { data, at: Date.now() })
      return data
    })
    .finally(() => inflight.delete(path))
  inflight.set(path, request)
  return request
}

interface Result<T> {
  path: string
  nonce: number
  data?: T
  error?: Error
}

export function useApi<T>(path: string | null) {
  const [result, setResult] = useState<Result<T> | null>(null)
  const [nonce, setNonce] = useState(0)

  useEffect(() => {
    if (!path) return
    let active = true
    fetchCached<T>(path, nonce > 0)
      .then((data) => active && setResult({ path, nonce, data }))
      .catch((error: Error) => active && setResult({ path, nonce, error }))
    return () => {
      active = false
    }
  }, [path, nonce])

  const reload = useCallback(() => setNonce((value) => value + 1), [])

  const current = result?.path === path ? result : null
  const data = current?.data ?? (path ? (cache.get(path)?.data as T | undefined) : undefined)
  const settled = current?.nonce === nonce
  const error = settled ? current?.error : undefined

  return {
    data,
    error,
    /** True only while there is nothing to show yet. */
    loading: path !== null && data === undefined && !error,
    /** True while a request is running, including background refreshes. */
    refreshing: path !== null && !settled,
    reload,
  }
}
