import type { ItemProps } from '@zag-js/steps'
import { createContext } from '../../utils/create-context.ts'

/**
 * Internal context carrying the static `{ index }` a `<Steps.Item>` was
 * given, so its children (`Trigger`/`Indicator`/`Separator`) can call the
 * main api's `getXProps(itemProps)` without threading the index manually.
 * Plain serializable data (unlike the derived `ItemState`, which carries a
 * function and is intentionally NOT shared via context — descendants that
 * need it call `api.getItemState(itemProps)` directly). Not exported from the
 * public `index.ts` (mirrors solid/react's internal-only usage).
 */
export const [StepsItemPropsProvider, useStepsItemPropsContext] = createContext<ItemProps>({
  name: 'ark.steps-item-props',
  hookName: 'useStepsItemPropsContext',
  providerName: '<Steps.Item />',
})
