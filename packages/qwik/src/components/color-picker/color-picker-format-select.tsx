import { mergeProps } from '@zag-js/qwik'
import { component$ } from '@qwik.dev/core'
import { type HTMLProps, type PolymorphicProps, ark } from '../factory.tsx'
import { useColorPickerContext } from './use-color-picker-context.ts'

const formats = ['rgba', 'hsla', 'hsba'] as const

export interface ColorPickerFormatSelectBaseProps extends PolymorphicProps<'select'> {}
export interface ColorPickerFormatSelectProps extends HTMLProps<'select'>, ColorPickerFormatSelectBaseProps {}

export const ColorPickerFormatSelect = component$<ColorPickerFormatSelectProps>((props) => {
  const api = useColorPickerContext()
  const formatSelectProps = api ? mergeProps(api.getFormatSelectProps(), props) : props

  return (
    <ark.select {...formatSelectProps}>
      {formats.map((format) => (
        <ark.option key={format} value={format}>
          {format}
        </ark.option>
      ))}
    </ark.select>
  )
})
