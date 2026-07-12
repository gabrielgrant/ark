import type { PresetTriggerProps } from '@zag-js/date-picker'
import { mergeProps } from '@zag-js/qwik'
import { Slot, component$ } from '@qwik.dev/core'
import type { Assign } from '../../types.ts'
import { type HTMLProps, type PolymorphicProps, ark } from '../factory.tsx'
import { useDatePickerContext } from './use-date-picker-context.ts'

const itemPropKeys = ['value'] as const

const ownKeySet = new Set<string>(itemPropKeys)

export interface DatePickerPresetTriggerBaseProps extends PresetTriggerProps, PolymorphicProps<'button'> {}
export interface DatePickerPresetTriggerProps extends Assign<HTMLProps<'button'>, DatePickerPresetTriggerBaseProps> {}

export const DatePickerPresetTrigger = component$<DatePickerPresetTriggerProps>((props) => {
  const record = props as unknown as Record<string, unknown>

  const presetTriggerProps = {} as PresetTriggerProps
  for (const key of itemPropKeys) {
    if (key in record) (presetTriggerProps as unknown as Record<string, unknown>)[key] = record[key]
  }

  const api = useDatePickerContext()

  const rest: Record<string, unknown> = {}
  for (const key in record) {
    if (!ownKeySet.has(key)) rest[key] = record[key]
  }

  const presetTriggerElProps = api ? mergeProps(api.getPresetTriggerProps(presetTriggerProps), rest) : rest

  return (
    <ark.button {...presetTriggerElProps}>
      <Slot />
    </ark.button>
  )
})
