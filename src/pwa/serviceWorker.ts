/** Registers the service worker that makes the app installable and keeps its shell available offline. */
export function registerServiceWorker() {
  // Production only: in development the files change on every save, and a cached copy would show stale code.
  if (!import.meta.env.PROD || !('serviceWorker' in navigator)) return

  window.addEventListener('load', () => {
    // Without a service worker the app still works online, so a failed registration is not shown to the user.
    navigator.serviceWorker.register('/sw.js').catch(() => {})
  })
}
