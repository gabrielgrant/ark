import { mergeProps } from '@zag-js/qwik'
import { Slot, component$ } from '@qwik.dev/core'
import { type HTMLProps, type PolymorphicProps, ark } from '../factory.tsx'
import { useSelectContext } from './use-select-context.ts'

export interface SelectLabelBaseProps extends PolymorphicProps<'label'> {}
export interface SelectLabelProps extends HTMLProps<'label'>, SelectLabelBaseProps {}

export const SelectLabel = component$<SelectLabelProps>((props) => {
  const api = useSelectContext()
  const labelProps = api
    ? mergeProps(
        api.getLabelProps() as unknown as Record<string, unknown>,
        props as unknown as Record<string, unknown> & SelectLabelProps,
      )
    : props

  return (
    <ark.label {...labelProps}>
      <Slot />
    </ark.label>
  )
})
