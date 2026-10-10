import { useEffect, useSyncExternalStore } from 'react'
import { apiDelete, apiGetBlob, apiPutFile, session } from './client.ts'
import { endpoints } from './endpoints.ts'

// The same limits as `PUT /me/photo` in the backend.
export const PHOTO_MAX_BYTES = 2 * 1024 * 1024
export const PHOTO_TYPES = ['image/jpeg', 'image/png', 'image/webp']

// The photo needs the API token, so it cannot be a plain image URL. It is fetched once and kept as a blob URL that
// every view shares: `undefined` until the first load ends, then the URL, or `null` when there is no photo.
let photoUrl: string | null | undefined
let request: Promise<void> | null = null
// Bumped on every change, so a load still running when the photo changes or the user signs out is dropped.
let generation = 0
const listeners = new Set<() => void>()

function publish(next: string | null | undefined) {
  generation += 1
  request = null
  if (photoUrl) URL.revokeObjectURL(photoUrl)
  photoUrl = next
  listeners.forEach((listener) => listener())
}

function subscribe(listener: () => void) {
  listeners.add(listener)
  return () => {
    listeners.delete(listener)
  }
}

const getSnapshot = () => photoUrl

function load() {
  // Signed out (or the session just ended): there is no photo to fetch.
  if (photoUrl !== undefined || request || !session.token) return
  const current = generation
  request = apiGetBlob(endpoints.photo).then(
    (blob) => {
      if (current === generation) publish(URL.createObjectURL(blob))
    },
    () => {
      // A missing photo (404) and a failed request both show the initials. A reload tries the photo again.
      if (current === generation) publish(null)
    },
  )
}

/** Forgets the photo, on sign-out and sign-in, so the next student never sees it. */
export function clearPhoto() {
  publish(undefined)
}

export async function uploadPhoto(file: File) {
  await apiPutFile(endpoints.photo, file)
  publish(URL.createObjectURL(file))
}

export async function deletePhoto() {
  await apiDelete(endpoints.photo)
  publish(null)
}

/** The signed-in student's photo as a blob URL: `null` when there is none, `undefined` while it loads. */
export function usePhotoUrl() {
  const url = useSyncExternalStore(subscribe, getSnapshot)
  useEffect(() => {
    if (url === undefined) load()
  }, [url])
  return url
}
