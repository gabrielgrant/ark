import type { ItemProps } from '@zag-js/accordion'
import { createContext } from '../../utils/create-context.ts'

/**
 * Internal context carrying the static `{ value, disabled }` props an
 * `<Accordion.Item>` was given, so its sub-parts (ItemTrigger/ItemContent/
 * ItemIndicator) can call the main api's `getItemXProps(itemProps)` without
 * needing the props threaded through manually. Not exported from the public
 * `index.ts` (mirrors solid/react).
 */
export const [AccordionItemPropsProvider, useAccordionItemPropsContext] = createContext<ItemProps>({
  name: 'ark.accordion-item-props',
  hookName: 'useAccordionItemPropsContext',
  providerName: '<Accordion.Item />',
})
