import type { ItemProps } from '@zag-js/cascade-select'
import { mergeProps } from '@zag-js/qwik'
import { Slot, component$ } from '@qwik.dev/core'
import { type HTMLProps, type PolymorphicProps, ark } from '../factory.tsx'
import { useCascadeSelectContext } from './use-cascade-select-context.ts'

const listPropKeys = ['item', 'indexPath', 'value'] as const

const ownKeySet = new Set<string>(listPropKeys)

export interface CascadeSelectListBaseProps extends ItemProps, PolymorphicProps<'div'> {}
export interface CascadeSelectListProps extends HTMLProps<'div'>, CascadeSelectListBaseProps {}

/**
 * Represents the list of children for a given PARENT node -- pass the
 * parent's `{ item, indexPath, value }` directly (for the top-level list,
 * that is the collection's `rootNode` with an empty `indexPath`/`value`).
 * There is no framework precedent for cascade-select (unported in
 * solid/react as of writing); this mirrors `TreeView.Tree` + the app-level
 * recursion pattern from zag's own Qwik example
 * (`zag/examples/qwik-ts/.../cascade-select/basic/index.tsx`): the consuming
 * app recurses by rendering another `<CascadeSelect.List>` for
 * `useCascadeSelectItemContext()?.highlightedChild` when it has children.
 */
export const CascadeSelectList = component$<CascadeSelectListProps>((props) => {
  const record = props as unknown as Record<string, unknown>

  const listItemProps = {} as ItemProps
  for (const key of listPropKeys) {
    if (key in record) (listItemProps as unknown as Record<string, unknown>)[key] = record[key]
  }

  const api = useCascadeSelectContext()

  const rest: Record<string, unknown> = {}
  for (const key in record) {
    if (!ownKeySet.has(key)) rest[key] = record[key]
  }

  const listProps = api ? mergeProps(api.getListProps(listItemProps), rest) : rest

  return (
    <ark.div {...listProps}>
      <Slot />
    </ark.div>
  )
})
