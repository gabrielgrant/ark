import type { ItemProps } from '@zag-js/radio-group'
import { mergeProps } from '@zag-js/qwik'
import { Slot, component$ } from '@qwik.dev/core'
import type { Assign } from '../../types.ts'
import { type HTMLProps, type PolymorphicProps, ark } from '../factory.tsx'
import { useRadioGroupContext } from './use-radio-group-context.ts'
import { RadioGroupItemProvider, useRadioGroupItemStoreValue } from './use-radio-group-item-context.ts'
import { RadioGroupItemPropsProvider } from './use-radio-group-item-props-context.ts'

const itemPropKeys = ['value', 'disabled', 'invalid'] as const

const ownKeySet = new Set<string>(itemPropKeys)

export interface RadioGroupItemBaseProps extends ItemProps, PolymorphicProps<'label'> {}
export interface RadioGroupItemProps extends Assign<HTMLProps<'label'>, RadioGroupItemBaseProps> {}

export const RadioGroupItem = component$<RadioGroupItemProps>((props) => {
  const record = props as unknown as Record<string, unknown>

  const itemProps = {} as ItemProps
  for (const key of itemPropKeys) {
    if (key in record) (itemProps as unknown as Record<string, unknown>)[key] = record[key]
  }

  const api = useRadioGroupContext()
  const itemState = api?.getItemState(itemProps)

  RadioGroupItemPropsProvider(itemProps)
  RadioGroupItemProvider(useRadioGroupItemStoreValue(itemState))

  const rest: Record<string, unknown> = {}
  for (const key in record) {
    if (!ownKeySet.has(key)) rest[key] = record[key]
  }

  const itemRootProps = api ? mergeProps(api.getItemProps(itemProps), rest) : rest

  return (
    <ark.label {...itemRootProps}>
      <Slot />
    </ark.label>
  )
})
