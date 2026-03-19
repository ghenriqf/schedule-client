export const authEvents = new EventTarget()

export const AUTH_EVENTS = {
  UNAUTHORIZED: 'unauthorized',
} as const

export function emitUnauthorized() {
  authEvents.dispatchEvent(new Event(AUTH_EVENTS.UNAUTHORIZED))
}