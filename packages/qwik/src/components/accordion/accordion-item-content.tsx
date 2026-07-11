import { mergeProps } from '@zag-js/qwik'
import { Slot, component$ } from '@qwik.dev/core'
import type { CollapsibleContentProps } from '../collapsible/collapsible-content.tsx'
import { Collapsible } from '../collapsible/index.ts'
import type { HTMLProps, PolymorphicProps } from '../factory.tsx'
import { useAccordionContext } from './use-accordion-context.ts'
import { useAccordionItemPropsContext } from './use-accordion-item-props-context.ts'

export interface AccordionItemContentBaseProps extends PolymorphicProps<'div'> {}
export interface AccordionItemContentProps extends HTMLProps<'div'>, AccordionItemContentBaseProps {}

/**
 * The accordion machine's own `getItemContentProps` computes `hidden`/
 * `data-state` from the *accordion's* notion of expanded/collapsed, but the
 * actual visibility (incl. exit-animation timing) is owned by the nested
 * `Collapsible.Root`'s own machine (see `accordion-item.tsx`). Strip those two
 * keys so the inner Collapsible.Content's own computed props win.
 */
const omitKeySet = new Set<string>(['hidden', 'data-state'])

export const AccordionItemContent = component$<AccordionItemContentProps>((props) => {
  const api = useAccordionContext()
  const itemProps = useAccordionItemPropsContext()

  const contentProps = api ? (api.getItemContentProps(itemProps) as Record<string, unknown>) : {}
  const ownContentProps: Record<string, unknown> = {}
  for (const key in contentProps) {
    if (!omitKeySet.has(key)) ownContentProps[key] = contentProps[key]
  }

  const mergedProps = mergeProps(ownContentProps, props as Record<string, unknown>)

  return (
    <Collapsible.Content {...(mergedProps as unknown as CollapsibleContentProps)}>
      <Slot />
    </Collapsible.Content>
  )
})
