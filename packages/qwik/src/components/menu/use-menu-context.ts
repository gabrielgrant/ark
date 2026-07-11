import type * as menu from '@zag-js/menu'
import type { PropTypes } from '@zag-js/qwik'
import { createContext } from '../../utils/create-context.ts'
import type { ApiStore } from '../../utils/use-api-store.ts'

export interface MenuApiStore extends ApiStore<menu.Api<PropTypes>> {}

/**
 * Non-strict (unlike most `useXContext` hooks in this package): a top-level
 * `<Menu.Root>` has no ancestor menu, so this legitimately resolves to
 * `undefined` rather than throwing -- consumers must guard, same contract as
 * `useFieldContext`.
 */
export const [MenuProvider, useMenuStore] = createContext<MenuApiStore | undefined>({
  name: 'ark.menu',
  hookName: 'useMenuContext',
  providerName: '<Menu.Root />',
  strict: false,
})

export type UseMenuContext = menu.Api<PropTypes>

export const useMenuContext = (): menu.Api<PropTypes> | undefined => useMenuStore()?.api
