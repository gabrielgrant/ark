import { mergeProps } from '@zag-js/qwik'
import { Slot, component$ } from '@qwik.dev/core'
import { type HTMLProps, type PolymorphicProps, ark } from '../factory.tsx'
import { useColorPickerAreaPropsContext } from './use-color-picker-area-props-context.ts'
import { useColorPickerContext } from './use-color-picker-context.ts'

export interface ColorPickerAreaThumbBaseProps extends PolymorphicProps<'div'> {}
export interface ColorPickerAreaThumbProps extends HTMLProps<'div'>, ColorPickerAreaThumbBaseProps {}

export const ColorPickerAreaThumb = component$<ColorPickerAreaThumbProps>((props) => {
  const api = useColorPickerContext()
  const areaProps = useColorPickerAreaPropsContext()
  const areaThumbProps = api ? mergeProps(api.getAreaThumbProps(areaProps), props) : props

  return (
    <ark.div {...areaThumbProps}>
      <Slot />
    </ark.div>
  )
})
