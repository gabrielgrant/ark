import type { ItemState, OptionItemState } from '@zag-js/menu'
import { useStore } from '@qwik.dev/core'
import { createContext } from '../../utils/create-context.ts'

/**
 * Item-level context (R2 companion): `ItemState`/`OptionItemState` is plain
 * serializable data (no closures), so it does not need `noSerialize` -- but
 * it is still wrapped in a `useStore` that is rewritten on every render of
 * `<Menu.Item>`/`<Menu.CheckboxItem>`/`<Menu.RadioItem>`, so consumers deep in
 * the tree that read it during their own render stay subscribed and up to
 * date.
 */
export interface MenuItemState extends Omit<OptionItemState, 'checked'> {
  checked?: boolean
}

export interface MenuItemStore {
  state: MenuItemState | undefined
}

export const [MenuItemProvider, useMenuItemStore] = createContext<MenuItemStore>({
  name: 'ark.menu-item',
  hookName: 'useMenuItemContext',
  providerName: '<Menu.Item />',
})

export interface UseMenuItemContext extends MenuItemState {}

export const useMenuItemContext = (): MenuItemState | undefined => useMenuItemStore().state

export const useMenuItemStoreValue = (state: ItemState | OptionItemState | undefined): MenuItemStore => {
  const store = useStore<MenuItemStore>({ state })
  store.state = state
  return store
}
