import type { TriggerProps } from '@zag-js/combobox'
import { mergeProps } from '@zag-js/qwik'
import { Slot, component$ } from '@qwik.dev/core'
import { type HTMLProps, type PolymorphicProps, ark } from '../factory.tsx'
import { useComboboxContext } from './use-combobox-context.ts'

const triggerPropKeys = ['focusable'] as const

const ownKeySet = new Set<string>(triggerPropKeys)

export interface ComboboxTriggerBaseProps extends TriggerProps, PolymorphicProps<'button'> {}
export interface ComboboxTriggerProps extends HTMLProps<'button'>, ComboboxTriggerBaseProps {}

export const ComboboxTrigger = component$<ComboboxTriggerProps>((props) => {
  const record = props as unknown as Record<string, unknown>

  const triggerProps = {} as TriggerProps
  for (const key of triggerPropKeys) {
    if (key in record) (triggerProps as unknown as Record<string, unknown>)[key] = record[key]
  }

  const api = useComboboxContext()

  const rest: Record<string, unknown> = {}
  for (const key in record) {
    if (!ownKeySet.has(key)) rest[key] = record[key]
  }

  const triggerElProps = api ? mergeProps(api.getTriggerProps(triggerProps), rest) : rest

  return (
    <ark.button {...triggerElProps}>
      <Slot />
    </ark.button>
  )
})
