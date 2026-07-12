import type { JsonNodePreviewOptions } from '@zag-js/json-tree-utils'
import { createContext } from '../../utils/create-context.ts'

export interface JsonTreeViewOptions extends Partial<JsonNodePreviewOptions> {
  /**
   * Whether to show quotes on the keys.
   */
  quotesOnKeys?: boolean
}

export const [JsonTreeViewPropsProvider, useJsonTreeViewPropsContext] = createContext<JsonTreeViewOptions>({
  name: 'ark.json-tree-view-props',
  hookName: 'useJsonTreeViewPropsContext',
  providerName: '<JsonTreeView.Root />',
  strict: false,
  defaultValue: {},
})
