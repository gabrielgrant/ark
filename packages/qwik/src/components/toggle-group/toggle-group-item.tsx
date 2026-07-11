import type { ItemProps } from '@zag-js/toggle-group'
import { mergeProps } from '@zag-js/qwik'
import { Slot, component$ } from '@qwik.dev/core'
import type { Assign } from '../../types.ts'
import { type HTMLProps, type PolymorphicProps, ark } from '../factory.tsx'
import { useToggleGroupContext } from './use-toggle-group-context.ts'

const itemPropKeys = ['value', 'disabled'] as const

const ownKeySet = new Set<string>(itemPropKeys)

export interface ToggleGroupItemBaseProps extends ItemProps, PolymorphicProps<'button'> {}
export interface ToggleGroupItemProps extends Assign<HTMLProps<'button'>, ToggleGroupItemBaseProps> {}

export const ToggleGroupItem = component$<ToggleGroupItemProps>((props) => {
  const record = props as unknown as Record<string, unknown>

  const itemProps = {} as ItemProps
  for (const key of itemPropKeys) {
    if (key in record) (itemProps as unknown as Record<string, unknown>)[key] = record[key]
  }

  const api = useToggleGroupContext()

  const rest: Record<string, unknown> = {}
  for (const key in record) {
    if (!ownKeySet.has(key)) rest[key] = record[key]
  }

  const itemButtonProps = api ? mergeProps(api.getItemProps(itemProps), rest) : rest

  return (
    <ark.button {...itemButtonProps}>
      <Slot />
    </ark.button>
  )
})
