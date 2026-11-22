import { useCallback, useEffect, useState } from 'react'
import { apiGet, isAbort } from './client.ts'
import { clearPhoto } from './photo.ts'

// Every call scrapes the university portal live, so responses are kept for a while
// and shared between components instead of being re-fetched on each navigation.
const FRESH_MS = 5 * 60 * 1000

const cache = new Map<string, { data: unknown; at: number }>()
// A request is shared by every component that asks for the path. It is cancelled only when the last of them leaves,
// so switching tabs stops the portal scrape that nobody is waiting for any more.
interface Inflight {
  promise: Promise<unknown>
  controller: AbortController
  waiting: number
}
const inflight = new Map<string, Inflight>()

export function clearApiCache() {
  cache.clear()
  inflight.forEach((entry) => entry.controller.abort())
  inflight.clear()
  clearPhoto()
}

/** `signal` ends this caller's interest: the shared request is aborted once no caller is left waiting for it. */
export function fetchCached<T>(path: string, force = false, signal?: AbortSignal): Promise<T> {
  const hit = cache.get(path)
  if (!force && hit && Date.now() - hit.at < FRESH_MS) return Promise.resolve(hit.data as T)

  let entry = inflight.get(path)
  if (!entry) {
    const controller = new AbortController()
    const created: Inflight = {
      controller,
      waiting: 0,
      promise: apiGet<T>(path, controller.signal)
        .then((data) => {
          cache.set(path, { data, at: Date.now() })
          return data
        })
        .finally(() => {
          if (inflight.get(path) === created) inflight.delete(path)
        }),
    }
    created.promise.catch(() => {}) // an abort nobody waits for must not surface as an unhandled rejection
    inflight.set(path, created)
    entry = created
  }

  const shared = entry
  if (!signal) return shared.promise as Promise<T>

  shared.waiting += 1
  return new Promise<T>((resolve, reject) => {
    const leave = () => {
      shared.waiting -= 1
      if (shared.waiting <= 0 && inflight.get(path) === shared) {
        inflight.delete(path)
        shared.controller.abort()
      }
      reject(new DOMException('Aborted', 'AbortError'))
    }
    if (signal.aborted) return leave()
    signal.addEventListener('abort', leave, { once: true })
    shared.promise.then(
      (data) => {
        signal.removeEventListener('abort', leave)
        shared.waiting -= 1
        resolve(data as T)
      },
      (error) => {
        signal.removeEventListener('abort', leave)
        shared.waiting -= 1
        reject(error)
      },
    )
  })
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
    const controller = new AbortController()
    fetchCached<T>(path, nonce > 0, controller.signal)
      .then((data) => setResult({ path, nonce, data }))
      .catch((error: Error) => {
        if (!isAbort(error)) setResult({ path, nonce, error })
      })
    return () => controller.abort()
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
