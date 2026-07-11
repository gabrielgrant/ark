import type { ItemProps } from '@zag-js/navigation-menu'
import { mergeProps } from '@zag-js/qwik'
import { Slot, component$ } from '@qwik.dev/core'
import type { Assign } from '../../types.ts'
import { type HTMLProps, type PolymorphicProps, ark } from '../factory.tsx'
import { useNavigationMenuContext } from './use-navigation-menu-context.ts'
import { useNavigationMenuItemPropsContext } from './use-navigation-menu-item-props-context.ts'

export interface NavigationMenuTriggerBaseProps extends Omit<ItemProps, 'value'>, PolymorphicProps<'button'> {}
export interface NavigationMenuTriggerProps extends Assign<HTMLProps<'button'>, NavigationMenuTriggerBaseProps> {}

export const NavigationMenuTrigger = component$<NavigationMenuTriggerProps>((props) => {
  const itemContext = useNavigationMenuItemPropsContext()
  if (!itemContext) {
    throw new Error('NavigationMenu.Trigger must be used within NavigationMenu.Item')
  }

  const record = props as unknown as Record<string, unknown>
  const triggerProps: ItemProps = {
    value: itemContext.value,
    disabled: (record.disabled as boolean | undefined) ?? itemContext.disabled,
  }

  const api = useNavigationMenuContext()

  const rest: Record<string, unknown> = {}
  for (const key in record) {
    if (key !== 'disabled') rest[key] = record[key]
  }

  const triggerButtonProps = api ? mergeProps(api.getTriggerProps(triggerProps), rest) : rest

  return (
    <ark.button {...triggerButtonProps}>
      <Slot />
    </ark.button>
  )
})
