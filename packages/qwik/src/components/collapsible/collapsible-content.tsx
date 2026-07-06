import { mergeProps } from '@zag-js/qwik'
import { Slot, component$ } from '@qwik.dev/core'
import { type HTMLProps, type PolymorphicProps, ark } from '../factory.tsx'
import { useCollapsibleContext } from './use-collapsible-context.ts'

export interface CollapsibleContentBaseProps extends PolymorphicProps<'div'> {}
export interface CollapsibleContentProps extends HTMLProps<'div'>, CollapsibleContentBaseProps {}

export const CollapsibleContent = component$<CollapsibleContentProps>((props) => {
  const api = useCollapsibleContext()

  if (api?.unmounted) return null

  const contentProps = api ? mergeProps(api.getContentProps(), props) : props

  return (
    <ark.div {...contentProps}>
      <Slot />
    </ark.div>
  )
})
