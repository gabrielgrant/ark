import { mergeProps } from '@zag-js/qwik'
import { Slot, component$ } from '@qwik.dev/core'
import { type HTMLProps, type PolymorphicProps, ark } from '../factory.tsx'
import { useColorPickerAreaPropsContext } from './use-color-picker-area-props-context.ts'
import { useColorPickerContext } from './use-color-picker-context.ts'

export interface ColorPickerAreaBackgroundBaseProps extends PolymorphicProps<'div'> {}
export interface ColorPickerAreaBackgroundProps extends HTMLProps<'div'>, ColorPickerAreaBackgroundBaseProps {}

export const ColorPickerAreaBackground = component$<ColorPickerAreaBackgroundProps>((props) => {
  const api = useColorPickerContext()
  const areaProps = useColorPickerAreaPropsContext()
  const areaBackgroundProps = api ? mergeProps(api.getAreaBackgroundProps(areaProps), props) : props

  return (
    <ark.div {...areaBackgroundProps}>
      <Slot />
    </ark.div>
  )
})
