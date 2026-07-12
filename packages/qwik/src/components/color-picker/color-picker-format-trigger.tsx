import { mergeProps } from '@zag-js/qwik'
import { Slot, component$ } from '@qwik.dev/core'
import { type HTMLProps, type PolymorphicProps, ark } from '../factory.tsx'
import { useColorPickerContext } from './use-color-picker-context.ts'

export interface ColorPickerFormatTriggerBaseProps extends PolymorphicProps<'button'> {}
export interface ColorPickerFormatTriggerProps extends HTMLProps<'button'>, ColorPickerFormatTriggerBaseProps {}

export const ColorPickerFormatTrigger = component$<ColorPickerFormatTriggerProps>((props) => {
  const api = useColorPickerContext()
  const formatTriggerProps = api ? mergeProps(api.getFormatTriggerProps(), props) : props

  return (
    <ark.button {...formatTriggerProps}>
      <Slot />
    </ark.button>
  )
})
