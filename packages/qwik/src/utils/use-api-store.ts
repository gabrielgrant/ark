import { type NoSerialize, noSerialize, useStore } from '@qwik.dev/core'

export interface ApiStore<T> {
  api: NoSerialize<T> | undefined
}

/**
 * Shared-context container for a machine `api` (a bag of non-serializable
 * closures). The store itself is serializable, so it can cross `component$`
 * boundaries via context; the api is rewritten on every render of the owner so
 * subscribed parts re-render with the fresh closures. `api` is `undefined`
 * during the dormant (pre-wake) client phase — consumers must guard.
 */
export function useApiStore<T extends object>(api: T): ApiStore<T> {
  const store = useStore<ApiStore<T>>({ api: noSerialize(api) })
  store.api = noSerialize(api)
  return store
}
