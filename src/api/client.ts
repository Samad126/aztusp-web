// In dev, requests go through the Vite proxy (same origin); in production they hit the API host directly.
import i18n from '../i18n/index.ts'

const API_BASE: string =
  import.meta.env.VITE_API_URL ?? (import.meta.env.DEV ? '' : 'https://aztuapi.alakbaroff.com')

const TOKEN_KEY = 'userhelper-token'
const USER_KEY = 'userhelper-username'

export class ApiError extends Error {
  status: number

  constructor(status: number, message: string) {
    super(message)
    this.name = 'ApiError'
    this.status = status
  }
}

function read(key: string) {
  try {
    return window.localStorage.getItem(key)
  } catch {
    return null
  }
}

function write(key: string, value: string | null) {
  try {
    if (value === null) window.localStorage.removeItem(key)
    else window.localStorage.setItem(key, value)
  } catch {
    // Storage blocked: the session lasts until the page is reloaded.
  }
}

// Kept in memory too, so a blocked localStorage doesn't break the current session.
let token = read(TOKEN_KEY)
let username = read(USER_KEY)
let onUnauthorized: (() => void) | null = null

export const session = {
  get token() {
    return token
  },
  get username() {
    return username
  },
  set(nextToken: string, nextUsername: string) {
    token = nextToken
    username = nextUsername
    write(TOKEN_KEY, nextToken)
    write(USER_KEY, nextUsername)
  },
  clear() {
    token = null
    username = null
    write(TOKEN_KEY, null)
    write(USER_KEY, null)
  },
  /** Called when the API rejects the token (expired portal session or replaced token). */
  onUnauthorized(handler: (() => void) | null) {
    onUnauthorized = handler
  },
}

interface SendOptions {
  /** A 401 from a password check means the site rejected the password, not that the token expired. */
  keepSession?: boolean
}

async function send(path: string, init: RequestInit = {}, { keepSession = false }: SendOptions = {}) {
  const headers = new Headers(init.headers)
  if (token) headers.set('Authorization', `Bearer ${token}`)

  let response: Response
  try {
    response = await fetch(API_BASE + path, { ...init, headers })
  } catch {
    throw new ApiError(0, i18n.t('error.network'))
  }

  if (!response.ok) {
    let message = response.statusText || 'Request failed'
    try {
      const body = await response.json()
      if (typeof body?.detail === 'string') message = body.detail
      // A 422 lists each invalid field with an English message, so show one translated line instead.
      else if (Array.isArray(body?.detail)) message = i18n.t('error.invalid')
    } catch {
      // Non-JSON error body (e.g. a gateway page): keep the status text.
    }
    if (response.status === 401 && token && !keepSession) {
      session.clear()
      onUnauthorized?.()
    }
    if (response.status === 502 || response.status === 504) message = i18n.t('error.portal')
    throw new ApiError(response.status, message)
  }
  return response
}

export async function apiGet<T>(path: string): Promise<T> {
  return (await send(path)).json()
}

async function sendJson<T>(method: string, path: string, body?: unknown, options?: SendOptions): Promise<T> {
  const response = await send(
    path,
    {
      method,
      headers: body === undefined ? undefined : { 'Content-Type': 'application/json' },
      body: body === undefined ? undefined : JSON.stringify(body),
    },
    options,
  )
  return response.json()
}

export function apiPost<T>(path: string, body?: unknown): Promise<T> {
  return sendJson<T>('POST', path, body)
}

export function apiPut<T>(path: string, body: unknown, options?: SendOptions): Promise<T> {
  return sendJson<T>('PUT', path, body, options)
}

export function apiDelete<T = unknown>(path: string): Promise<T> {
  return sendJson<T>('DELETE', path)
}

function fileNameFrom(header: string | null) {
  if (!header) return null
  const encoded = /filename\*=UTF-8''([^;]+)/i.exec(header)
  if (encoded) {
    try {
      return decodeURIComponent(encoded[1])
    } catch {
      // Fall through to the plain filename.
    }
  }
  return /filename="?([^";]+)"?/i.exec(header)?.[1] ?? null
}

/** Downloads a protected file through the API and hands it to the browser as a save. */
export async function downloadFile(path: string, fallbackName: string) {
  const response = await send(path)
  const blob = await response.blob()
  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = url
  link.download = fileNameFrom(response.headers.get('Content-Disposition')) ?? fallbackName
  document.body.appendChild(link)
  link.click()
  link.remove()
  URL.revokeObjectURL(url)
}
