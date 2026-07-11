import type { ItemProps } from '@zag-js/accordion'
import { mergeProps } from '@zag-js/qwik'
import { Slot, component$ } from '@qwik.dev/core'
import { useRenderStrategyContext } from '../../utils/render-strategy.ts'
import type { CollapsibleRootProps } from '../collapsible/collapsible-root.tsx'
import { Collapsible } from '../collapsible/index.ts'
import type { HTMLProps, PolymorphicProps } from '../factory.tsx'
import { useAccordionContext } from './use-accordion-context.ts'
import { AccordionItemProvider, useAccordionItemStoreValue } from './use-accordion-item-context.ts'
import { AccordionItemPropsProvider } from './use-accordion-item-props-context.ts'

const itemPropKeys = ['value', 'disabled'] as const

const ownKeySet = new Set<string>(itemPropKeys)

export interface AccordionItemBaseProps extends ItemProps, PolymorphicProps<'div'> {}
export interface AccordionItemProps extends HTMLProps<'div'>, AccordionItemBaseProps {}

export const AccordionItem = component$<AccordionItemProps>((props) => {
  const record = props as unknown as Record<string, unknown>

  const itemProps = {} as ItemProps
  for (const key of itemPropKeys) {
    if (key in record) (itemProps as unknown as Record<string, unknown>)[key] = record[key]
  }

  const api = useAccordionContext()
  const renderStrategy = useRenderStrategyContext()
  const itemState = api?.getItemState(itemProps)
  const itemContentId = api?.getItemContentProps(itemProps).id

  AccordionItemPropsProvider(itemProps)
  AccordionItemProvider(useAccordionItemStoreValue(itemState))

  const rest: Record<string, unknown> = {}
  for (const key in record) {
    if (!ownKeySet.has(key)) rest[key] = record[key]
  }

  const itemRootProps = api ? mergeProps(api.getItemProps(itemProps), rest) : rest

  return (
    <Collapsible.Root
      open={itemState?.expanded}
      ids={{ content: itemContentId }}
      {...renderStrategy}
      {...(itemRootProps as unknown as CollapsibleRootProps)}
    >
      <Slot />
    </Collapsible.Root>
  )
})
