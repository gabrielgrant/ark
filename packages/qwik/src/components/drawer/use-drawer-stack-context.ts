import type { DrawerStackApi } from '@zag-js/drawer'
import type { PropTypes } from '@zag-js/qwik'
import { createContext } from '../../utils/create-context.ts'
import type { ApiStore } from '../../utils/use-api-store.ts'

export interface UseDrawerStackContext extends DrawerStackApi<PropTypes> {}

/** R2 store context for the connected stack api (indent parts read it). */
export interface DrawerStackApiStore extends ApiStore<UseDrawerStackContext> {}

export const [DrawerStackProvider, useDrawerStackApiStore] = createContext<DrawerStackApiStore>({
  name: 'ark.drawer-stack',
  hookName: 'useDrawerStackContext',
  providerName: '<DrawerStack />',
})

export const useDrawerStackContext = (): UseDrawerStackContext | undefined => useDrawerStackApiStore().api
