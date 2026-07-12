import { mergeProps } from '@zag-js/qwik'
import { Slot, component$ } from '@qwik.dev/core'
import { type HTMLProps, type PolymorphicProps, ark } from '../factory.tsx'
import { useColorPickerContext } from './use-color-picker-context.ts'

export interface ColorPickerEyeDropperTriggerBaseProps extends PolymorphicProps<'button'> {}
export interface ColorPickerEyeDropperTriggerProps extends HTMLProps<'button'>, ColorPickerEyeDropperTriggerBaseProps {}

export const ColorPickerEyeDropperTrigger = component$<ColorPickerEyeDropperTriggerProps>((props) => {
  const api = useColorPickerContext()
  const eyeDropperTriggerProps = api ? mergeProps(api.getEyeDropperTriggerProps(), props) : props

  return (
    <ark.button {...eyeDropperTriggerProps}>
      <Slot />
    </ark.button>
  )
})
