import type { ItemProps } from '@zag-js/cascade-select'
import { type JSXOutput, Slot, component$ } from '@qwik.dev/core'
import type { TreeNode } from '../collection.ts'
import { useCascadeSelectContext } from './use-cascade-select-context.ts'
import { CascadeSelectItemStateProvider, useCascadeSelectItemStoreValue } from './use-cascade-select-item-context.ts'
import { CascadeSelectItemPropsProvider } from './use-cascade-select-item-props-context.ts'

export interface CascadeSelectItemProviderBaseProps<T> extends ItemProps<T> {}
export interface CascadeSelectItemProviderProps<T> extends CascadeSelectItemProviderBaseProps<T> {}

const itemPropKeys = ['item', 'indexPath', 'value'] as const

/**
 * `component$` is not itself generic-callable; the underlying implementation
 * is written as a generic function and cast through `unknown` here (mirrors
 * `TreeViewNodeProvider`'s cast) so call sites keep the per-`T` node typing.
 */
export const CascadeSelectItemProvider = component$(<T extends TreeNode>(props: CascadeSelectItemProviderProps<T>) => {
  const record = props as unknown as Record<string, unknown>

  const itemProps = {} as ItemProps
  for (const key of itemPropKeys) {
    if (key in record) (itemProps as unknown as Record<string, unknown>)[key] = record[key]
  }

  const api = useCascadeSelectContext()
  const itemState = api?.getItemState(itemProps)

  CascadeSelectItemPropsProvider(itemProps)
  CascadeSelectItemStateProvider(useCascadeSelectItemStoreValue(itemState))

  return <Slot />
}) as unknown as CascadeSelectItemProviderComponent

export type CascadeSelectItemProviderComponent = <T extends TreeNode>(
  props: CascadeSelectItemProviderProps<T>,
) => JSXOutput
