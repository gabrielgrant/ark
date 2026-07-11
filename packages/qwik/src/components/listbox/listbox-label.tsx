import { mergeProps } from '@zag-js/qwik'
import { Slot, component$ } from '@qwik.dev/core'
import { type HTMLProps, type PolymorphicProps, ark } from '../factory.tsx'
import { useListboxContext } from './use-listbox-context.ts'

export interface ListboxLabelBaseProps extends PolymorphicProps<'span'> {}
export interface ListboxLabelProps extends HTMLProps<'span'>, ListboxLabelBaseProps {}

export const ListboxLabel = component$<ListboxLabelProps>((props) => {
  const api = useListboxContext()
  // zag's `getLabelProps` is typed `T["label"]` (bound to a real <label>
  // element's ref), but this part renders a <span> (matches solid/react) --
  // cast through `unknown` per R12 so the merged `ref` type comes from
  // `props` (Ref<HTMLSpanElement>) instead of the mismatched label type.
  const labelProps = api
    ? mergeProps(
        api.getLabelProps() as unknown as Record<string, unknown>,
        props as unknown as Record<string, unknown> & ListboxLabelProps,
      )
    : props

  return (
    <ark.span {...labelProps}>
      <Slot />
    </ark.span>
  )
})
