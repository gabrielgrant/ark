import type * as drawer from '@zag-js/drawer'
import type { NoSerialize } from '@qwik.dev/core'
import { createContext } from '../../utils/create-context.ts'

/**
 * Carries the raw `DrawerStack` store (a bag of closures — `noSerialize`, R2)
 * from `<DrawerStack>` down to every nested `<Drawer.Root>`'s machine, which
 * takes it as its `stack` prop. Non-strict: a standalone drawer simply has no
 * stack (`undefined`), matching the Solid/React ports.
 */
export interface DrawerStackStore {
  stack: NoSerialize<drawer.DrawerStack> | undefined
}

export const [DrawerStackStoreProvider, useDrawerStackStore] = createContext<DrawerStackStore | undefined>({
  name: 'ark.drawer-stack-store',
  hookName: 'useDrawerStackStore',
  providerName: '<DrawerStack />',
  strict: false,
  defaultValue: undefined,
})
