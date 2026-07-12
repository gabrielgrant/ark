import { noSerialize } from '@qwik.dev/core'
import { createContext } from '../../utils/create-context.ts'
import type { ApiStore } from '../../utils/use-api-store.ts'
import type { UseColorPickerReturn } from './use-color-picker.ts'

/**
 * The machine `api` is a bag of non-serializable closures, so it is shared as a
 * `noSerialize` value inside a store created by `<ColorPicker.Root>` (see
 * `useApiStore`). Parts read `store.api` (subscribing) and re-render when the
 * owner recomputes it. `api` is `undefined` while the component is dormant
 * (pre-wake) on the client -- parts must guard for it. See PLAN.md, rule R2.
 */
export interface ColorPickerApiStore extends ApiStore<UseColorPickerReturn> {}

export const [ColorPickerProvider, useColorPickerStore] = createContext<ColorPickerApiStore>({
  name: 'ark.color-picker',
  hookName: 'useColorPickerContext',
  providerName: '<ColorPicker.Root />',
})

export interface UseColorPickerContext extends UseColorPickerReturn {}

/**
 * Deep reads through the api store retain the read value in Qwik's SSR
 * serialization graph (established empirically for date-picker: reading
 * `api.weekDays.length` crashed SSR with Q20; `untrack()` did not help,
 * `noSerialize()`-tagging the nested class instances did). `api.value` is a
 * `Color` class instance and `connect()` rebuilds it fresh every render, so
 * it is re-tagged on every context read here.
 */
export const useColorPickerContext = (): UseColorPickerReturn | undefined => {
  const api = useColorPickerStore().api
  if (api && typeof api.value === 'object' && api.value !== null) noSerialize(api.value)
  return api
}
