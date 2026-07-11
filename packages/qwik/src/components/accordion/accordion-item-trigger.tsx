import { mergeProps } from '@zag-js/qwik'
import { Slot, component$ } from '@qwik.dev/core'
import { useCollapsibleContext } from '../collapsible/index.ts'
import { type HTMLProps, type PolymorphicProps, ark } from '../factory.tsx'
import { useAccordionContext } from './use-accordion-context.ts'
import { useAccordionItemPropsContext } from './use-accordion-item-props-context.ts'

export interface AccordionItemTriggerBaseProps extends PolymorphicProps<'button'> {}
export interface AccordionItemTriggerProps extends HTMLProps<'button'>, AccordionItemTriggerBaseProps {}

export const AccordionItemTrigger = component$<AccordionItemTriggerProps>((props) => {
  const api = useAccordionContext()
  const itemProps = useAccordionItemPropsContext()
  const collapsible = useCollapsibleContext()

  const triggerProps: Record<string, unknown> = api
    ? { ...(api.getItemTriggerProps(itemProps) as Record<string, unknown>) }
    : {}
  if (collapsible?.unmounted) delete triggerProps['aria-controls']

  const buttonProps = mergeProps(triggerProps, props as Record<string, unknown>)

  return (
    <ark.button {...buttonProps}>
      <Slot />
    </ark.button>
  )
})
