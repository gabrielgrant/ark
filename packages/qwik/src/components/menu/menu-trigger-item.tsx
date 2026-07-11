import { mergeProps } from '@zag-js/qwik'
import { Slot, component$ } from '@qwik.dev/core'
import { type HTMLProps, type PolymorphicProps, ark } from '../factory.tsx'
import { MenuItemPropsProvider } from './use-menu-item-props-context.ts'
import { useApiStore } from '../../utils/use-api-store.ts'
import { useMenuTriggerItemContext } from './use-menu-trigger-item-context.ts'

export interface MenuTriggerItemBaseProps extends PolymorphicProps<'div'> {}
export interface MenuTriggerItemProps extends HTMLProps<'div'>, MenuTriggerItemBaseProps {}

/**
 * Rendered inside a SUBMENU's tree but composed as an item of the PARENT
 * menu's list -- reads the parent-supplied trigger-item props off context
 * (populated by the submenu's own `<Menu.Root>`, see `menu-root.tsx`).
 */
export const MenuTriggerItem = component$<MenuTriggerItemProps>((props) => {
  const getTriggerItemProps = useMenuTriggerItemContext()
  const triggerItemProps = getTriggerItemProps?.()
  const mergedProps = triggerItemProps
    ? mergeProps(triggerItemProps, props as unknown as Record<string, unknown> & MenuTriggerItemProps)
    : props

  const record = mergedProps as Record<string, unknown>
  MenuItemPropsProvider(useApiStore({ value: record['data-value'] as string }))

  return (
    <ark.div {...mergedProps}>
      <Slot />
    </ark.div>
  )
})
