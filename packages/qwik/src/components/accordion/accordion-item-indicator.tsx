import { mergeProps } from '@zag-js/qwik'
import { Slot, component$ } from '@qwik.dev/core'
import { type HTMLProps, type PolymorphicProps, ark } from '../factory.tsx'
import { useAccordionContext } from './use-accordion-context.ts'
import { useAccordionItemPropsContext } from './use-accordion-item-props-context.ts'

export interface AccordionItemIndicatorBaseProps extends PolymorphicProps<'span'> {}
export interface AccordionItemIndicatorProps extends HTMLProps<'span'>, AccordionItemIndicatorBaseProps {}

/**
 * Rendered as `<span>`, not `<div>`: this part is typically nested inside
 * `<Accordion.ItemTrigger>` (a `<button>`), and Qwik's SSR enforces HTML
 * content models strictly (error Q12) — a `<div>` is not permitted inside
 * button phrasing content.
 */
export const AccordionItemIndicator = component$<AccordionItemIndicatorProps>((props) => {
  const api = useAccordionContext()
  const itemProps = useAccordionItemPropsContext()
  const indicatorProps = api ? mergeProps(api.getItemIndicatorProps(itemProps), props) : props

  return (
    <ark.span {...indicatorProps}>
      <Slot />
    </ark.span>
  )
})
