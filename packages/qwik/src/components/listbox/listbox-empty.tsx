import { Slot, component$ } from '@qwik.dev/core'
import { type HTMLProps, type PolymorphicProps, ark } from '../factory.tsx'
import { listboxAnatomy } from './listbox.anatomy.ts'
import { useListboxContext } from './use-listbox-context.ts'

const parts = listboxAnatomy.build()

export interface ListboxEmptyBaseProps extends PolymorphicProps<'div'> {}
export interface ListboxEmptyProps extends HTMLProps<'div'>, ListboxEmptyBaseProps {}

/**
 * Rule R11: always render and claim the `<Slot/>` -- conditionally omitting
 * it (as solid's `<Show when={size() === 0}>` does) leaves an unclaimed
 * projection marker in Qwik. Toggle visibility with `hidden` instead.
 */
export const ListboxEmpty = component$<ListboxEmptyProps>((props) => {
  const api = useListboxContext()
  const isEmpty = (api?.collection.size ?? 0) === 0

  return (
    <ark.div {...parts.empty.attrs} {...props} role="presentation" hidden={!isEmpty}>
      <Slot />
    </ark.div>
  )
})
