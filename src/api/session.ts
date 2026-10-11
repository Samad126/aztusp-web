import { readStorage, writeStorage } from '../lib/storage.ts'

const TOKEN_KEY = 'userhelper-token'
const USER_KEY = 'userhelper-username'
// Stands in for a real token in demo mode. It is never sent: demo requests are answered from the sample data.
export const DEMO_TOKEN = 'demo'

// Kept in memory too, so a blocked localStorage doesn't break the current session.
let token = readStorage(TOKEN_KEY)
let username = readStorage(USER_KEY)
let unauthorizedHandler: (() => void) | null = null

export const session = {
  get token() {
    return token
  },
  get username() {
    return username
  },
  get demo() {
    return token === DEMO_TOKEN
  },
  set(nextToken: string, nextUsername: string) {
    token = nextToken
    username = nextUsername
    writeStorage(TOKEN_KEY, nextToken)
    writeStorage(USER_KEY, nextUsername)
  },
  clear() {
    token = null
    username = null
    writeStorage(TOKEN_KEY, null)
    writeStorage(USER_KEY, null)
  },
  /** Called when the API rejects the token (expired portal session or replaced token). */
  onUnauthorized(handler: (() => void) | null) {
    unauthorizedHandler = handler
  },
  /** Ends the session after the API rejects its token, and tells the app so it can return to the sign-in page. */
  expire() {
    session.clear()
    unauthorizedHandler?.()
  },
}
