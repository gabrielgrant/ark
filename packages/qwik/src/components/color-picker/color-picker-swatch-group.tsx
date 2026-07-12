import { mergeProps } from '@zag-js/qwik'
import { Slot, component$ } from '@qwik.dev/core'
import { type HTMLProps, type PolymorphicProps, ark } from '../factory.tsx'
import { useColorPickerContext } from './use-color-picker-context.ts'

export interface ColorPickerSwatchGroupBaseProps extends PolymorphicProps<'div'> {}
export interface ColorPickerSwatchGroupProps extends HTMLProps<'div'>, ColorPickerSwatchGroupBaseProps {}

export const ColorPickerSwatchGroup = component$<ColorPickerSwatchGroupProps>((props) => {
  const api = useColorPickerContext()
  const swatchGroupProps = api ? mergeProps(api.getSwatchGroupProps(), props) : props

  return (
    <ark.div {...swatchGroupProps}>
      <Slot />
    </ark.div>
  )
})
