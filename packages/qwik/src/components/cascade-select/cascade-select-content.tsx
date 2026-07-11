import { mergeProps } from '@zag-js/qwik'
import { Slot, component$ } from '@qwik.dev/core'
import { type HTMLProps, type PolymorphicProps, ark } from '../factory.tsx'
import { useCascadeSelectContext } from './use-cascade-select-context.ts'

export interface CascadeSelectContentBaseProps extends PolymorphicProps<'div'> {}
export interface CascadeSelectContentProps extends HTMLProps<'div'>, CascadeSelectContentBaseProps {}

export const CascadeSelectContent = component$<CascadeSelectContentProps>((props) => {
  const api = useCascadeSelectContext()
  const contentProps = api ? mergeProps(api.getContentProps(), props) : props

  return (
    <ark.div {...contentProps}>
      <Slot />
    </ark.div>
  )
})
