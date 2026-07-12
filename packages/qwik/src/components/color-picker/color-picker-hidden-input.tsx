import { mergeProps } from '@zag-js/qwik'
import { component$ } from '@qwik.dev/core'
import { type HTMLProps, type PolymorphicProps, ark } from '../factory.tsx'
import { useFieldContext } from '../field/use-field-context.ts'
import { useColorPickerContext } from './use-color-picker-context.ts'

export interface ColorPickerHiddenInputBaseProps extends PolymorphicProps<'input'> {}
export interface ColorPickerHiddenInputProps extends HTMLProps<'input'>, ColorPickerHiddenInputBaseProps {}

export const ColorPickerHiddenInput = component$<ColorPickerHiddenInputProps>((props) => {
  const api = useColorPickerContext()
  const field = useFieldContext()
  const describedBy: Record<string, any> = field?.ariaDescribedby ? { 'aria-describedby': field.ariaDescribedby } : {}
  const inputProps = api
    ? mergeProps(describedBy, api.getHiddenInputProps(), props as Record<string, any>)
    : mergeProps(describedBy, props as Record<string, any>)

  return <ark.input {...inputProps} />
})
