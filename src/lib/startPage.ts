import type { StartPage } from '../api/types.ts'
import { startPages } from '../navigation.ts'
import { readStorage, writeStorage } from './storage.ts'

// The server keeps the choice so it follows the student to other devices. This copy lets the app open on the right
// page at once, without waiting for the request. It is refreshed from the server on every visit.
const key = (username: string) => `userhelper-start-page:${username}`

export function readStartPage(username: string): StartPage | null {
  const saved = readStorage(key(username))
  return startPages.find((page) => page.value === saved)?.value ?? null
}

export function writeStartPage(username: string, page: StartPage) {
  writeStorage(key(username), page)
}
