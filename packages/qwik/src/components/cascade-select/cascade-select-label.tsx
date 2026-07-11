import { mergeProps } from '@zag-js/qwik'
import { Slot, component$ } from '@qwik.dev/core'
import { type HTMLProps, type PolymorphicProps, ark } from '../factory.tsx'
import { useCascadeSelectContext } from './use-cascade-select-context.ts'

export interface CascadeSelectLabelBaseProps extends PolymorphicProps<'label'> {}
export interface CascadeSelectLabelProps extends HTMLProps<'label'>, CascadeSelectLabelBaseProps {}

export const CascadeSelectLabel = component$<CascadeSelectLabelProps>((props) => {
  const api = useCascadeSelectContext()
  const labelProps = api
    ? mergeProps(
        api.getLabelProps() as unknown as Record<string, unknown>,
        props as unknown as Record<string, unknown> & CascadeSelectLabelProps,
      )
    : props

  return (
    <ark.label {...labelProps}>
      <Slot />
    </ark.label>
  )
})
