// Storage can be blocked (private mode, disabled site data), so every access is guarded and a failed read gives null.

/** The saved value for a key, or null when there is none or storage is blocked. */
export function readStorage(key: string): string | null {
  try {
    return window.localStorage.getItem(key)
  } catch {
    return null
  }
}

/** Saves a value, or removes the key when `value` is null. A blocked write is dropped: the value just won't survive a reload. */
export function writeStorage(key: string, value: string | null) {
  try {
    if (value === null) window.localStorage.removeItem(key)
    else window.localStorage.setItem(key, value)
  } catch {
    // Storage blocked: the value lasts until the page is reloaded.
  }
}
