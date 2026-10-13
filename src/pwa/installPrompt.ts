import { useSyncExternalStore } from 'react'

/** Chrome and Edge fire this before showing their install prompt. It is not in the standard TypeScript DOM types. */
interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<{ outcome: 'accepted' | 'dismissed' }>
}

/**
 * - `installed`: the app already runs from the home screen or desktop, so there is nothing to offer.
 * - `installable`: the browser gave a prompt to show when the button is pressed.
 * - `ios`: Safari on iPhone and iPad has no prompt, so the button explains the steps instead.
 * - `unsupported`: any other browser, where the app can't be installed from the page.
 */
export type InstallState = 'installed' | 'installable' | 'ios' | 'unsupported'

function isStandalone() {
  return (
    window.matchMedia('(display-mode: standalone)').matches ||
    (navigator as Navigator & { standalone?: boolean }).standalone === true
  )
}

function isIos() {
  // iPadOS 13 and later reports itself as a Mac, so a touch-capable Mac is an iPad.
  return /iphone|ipad|ipod/i.test(navigator.userAgent) || (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1)
}

let deferredPrompt: BeforeInstallPromptEvent | null = null
let installed = isStandalone()
const listeners = new Set<() => void>()

function notify() {
  listeners.forEach((listener) => listener())
}

// Listens from startup (see main.tsx): the browser can offer the prompt before the settings page is mounted.
window.addEventListener('beforeinstallprompt', (event) => {
  // Stops the browser's own mini-infobar, so the install button on the settings page is the one way in.
  event.preventDefault()
  deferredPrompt = event as BeforeInstallPromptEvent
  notify()
})

window.addEventListener('appinstalled', () => {
  deferredPrompt = null
  installed = true
  notify()
})

function subscribe(listener: () => void) {
  listeners.add(listener)
  return () => {
    listeners.delete(listener)
  }
}

function getInstallState(): InstallState {
  if (installed) return 'installed'
  if (deferredPrompt) return 'installable'
  if (isIos()) return 'ios'
  return 'unsupported'
}

/** Where the app stands for installing: see InstallState. Updates when the browser offers or finishes an install. */
export function useInstallState() {
  return useSyncExternalStore(subscribe, getInstallState, getInstallState)
}

/** Opens the browser's install prompt. A prompt can only be shown once, so the button goes away after it. */
export async function promptInstall() {
  const event = deferredPrompt
  if (!event) return

  deferredPrompt = null
  notify()
  try {
    await event.prompt()
  } catch {
    // The browser refused to show the prompt, for example when it was not opened by a click. The button stays hidden.
  }
}
