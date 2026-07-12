import * as drawer from '@zag-js/drawer'
import { normalizeProps } from '@zag-js/qwik'
import { type NoSerialize, Slot, component$, noSerialize, useSignal, useStore } from '@qwik.dev/core'
import { useApiStore } from '../../utils/use-api-store.ts'
import { DrawerStackProvider } from './use-drawer-stack-context.ts'
import { DrawerStackStoreProvider, type DrawerStackStore } from './use-drawer-stack-store.ts'

export interface DrawerStackProps {
  children?: unknown
}

/**
 * Owns a `drawer.createStack()` store shared by nested drawers (Solid/React
 * parity). Two contexts flow down:
 * - the raw stack (closures — `noSerialize`, R2) for each `<Drawer.Root>`'s
 *   machine `stack` prop, via `DrawerStackStoreProvider`;
 * - the connected `DrawerStackApi` (R2 api store) for the Indent parts.
 *
 * The stack's `subscribe` bumps a serializable `useStore` counter, which this
 * component's render reads — so snapshot changes re-render this owner, which
 * recomputes `connectStack` and rewrites the api store (the standard R2
 * update path). The subscription is created exactly once per live stack
 * instance (guarded by the same signal that holds the stack). After a true
 * SSR-resume the `noSerialize` slots wake `undefined` and a fresh stack is
 * created client-side — drawers registered before resume don't exist yet, so
 * no state is lost (same CSR caveat class as R15).
 */
export const DrawerStack = component$<DrawerStackProps>(() => {
  const stackSig = useSignal<NoSerialize<drawer.DrawerStack>>()
  const version = useStore({ value: 0 })

  if (!stackSig.value) {
    const stack = drawer.createStack()
    stack.subscribe(() => {
      version.value++
    })
    stackSig.value = noSerialize(stack)
  }

  // subscribing read: snapshot changes bump `version`, re-rendering this owner
  void version.value

  const stackStore = useStore<DrawerStackStore>({ stack: undefined })
  stackStore.stack = stackSig.value
  DrawerStackStoreProvider(stackStore)

  const stack = stackSig.value
  const stackApi = drawer.connectStack(
    stack ? stack.getSnapshot() : { active: false, openCount: 0, swipeProgress: 0, frontmostHeight: 0 },
    normalizeProps,
  )
  const apiStore = useApiStore(stackApi)
  DrawerStackProvider(apiStore)

  return <Slot />
})
