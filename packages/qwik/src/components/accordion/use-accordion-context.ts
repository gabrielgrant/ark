import { createContext } from '../../utils/create-context.ts'
import type { ApiStore } from '../../utils/use-api-store.ts'
import type { UseAccordionReturn } from './use-accordion.ts'

export interface AccordionApiStore extends ApiStore<UseAccordionReturn> {}

export const [AccordionProvider, useAccordionStore] = createContext<AccordionApiStore>({
  name: 'ark.accordion',
  hookName: 'useAccordionContext',
  providerName: '<Accordion.Root />',
})

export interface UseAccordionContext extends UseAccordionReturn {}

export const useAccordionContext = (): UseAccordionReturn | undefined => useAccordionStore().api
