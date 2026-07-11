import type { ItemProps } from '@zag-js/menu'
import { mergeProps } from '@zag-js/qwik'
import { Slot, component$, useVisibleTask$ } from '@qwik.dev/core'
import type { Assign } from '../../types.ts'
import { useApiStore } from '../../utils/use-api-store.ts'
import { type HTMLProps, type PolymorphicProps, ark } from '../factory.tsx'
import { useMenuContext } from './use-menu-context.ts'
import { MenuItemProvider, useMenuItemStoreValue } from './use-menu-item-context.ts'
import { MenuItemPropsProvider } from './use-menu-item-props-context.ts'

interface ItemBaseProps extends ItemProps {
  /**
   * The function to call when the item is selected. Notification-only (fires
   * after the machine has already decided the item was selected), so it may
   * be QRL-wrapped like the other `onX$` callbacks (R9) -- but since it is
   * threaded through `addItemListener` at the DOM-event level (not a machine
   * prop), it stays a plain callback here; wrap with `$()` at the call site
   * if you need SSR-safe serialization of the closure itself is not
   * required (the listener is only attached client-side, see below).
   */
  onSelect?: VoidFunction
}

const itemPropKeys = ['closeOnSelect', 'disabled', 'value', 'valueText', 'onSelect'] as const

const ownKeySet = new Set<string>(itemPropKeys)

export interface MenuItemBaseProps extends ItemBaseProps, PolymorphicProps<'div'> {}
export interface MenuItemProps extends Assign<HTMLProps<'div'>, MenuItemBaseProps> {}

export const MenuItem = component$<MenuItemProps>((props) => {
  const record = props as unknown as Record<string, unknown>

  const itemProps = {} as ItemBaseProps
  for (const key of itemPropKeys) {
    if (key in record) (itemProps as unknown as Record<string, unknown>)[key] = record[key]
  }

  const api = useMenuContext()
  const itemState = api?.getItemState(itemProps)

  MenuItemPropsProvider(useApiStore(itemProps))
  MenuItemProvider(useMenuItemStoreValue(itemState))

  const itemId = itemState?.id
  const onSelect = itemProps.onSelect

  // biome-ignore lint/correctness/noQwikUseVisibleTask: DOM-id-keyed listener registration needs the committed DOM + live machine service, client-only (mirrors solid's createEffect/onCleanup)
  useVisibleTask$(({ cleanup }) => {
    if (!api || !itemId) return
    const dispose = api.addItemListener({ id: itemId, onSelect })
    if (dispose) cleanup(dispose)
  })

  const rest: Record<string, unknown> = {}
  for (const key in record) {
    if (!ownKeySet.has(key)) rest[key] = record[key]
  }

  const itemDivProps = api ? mergeProps(api.getItemProps(itemProps), rest) : rest

  return (
    <ark.div {...itemDivProps}>
      <Slot />
    </ark.div>
  )
})
