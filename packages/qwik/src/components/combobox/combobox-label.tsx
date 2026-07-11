import { mergeProps } from '@zag-js/qwik'
import { Slot, component$ } from '@qwik.dev/core'
import { type HTMLProps, type PolymorphicProps, ark } from '../factory.tsx'
import { useComboboxContext } from './use-combobox-context.ts'

export interface ComboboxLabelBaseProps extends PolymorphicProps<'label'> {}
export interface ComboboxLabelProps extends HTMLProps<'label'>, ComboboxLabelBaseProps {}

export const ComboboxLabel = component$<ComboboxLabelProps>((props) => {
  const api = useComboboxContext()
  const labelProps = api
    ? mergeProps(
        api.getLabelProps() as unknown as Record<string, unknown>,
        props as unknown as Record<string, unknown> & ComboboxLabelProps,
      )
    : props

  return (
    <ark.label {...labelProps}>
      <Slot />
    </ark.label>
  )
})
