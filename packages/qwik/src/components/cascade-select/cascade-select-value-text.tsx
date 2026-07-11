import { mergeProps } from '@zag-js/qwik'
import { Slot, component$ } from '@qwik.dev/core'
import { type HTMLProps, type PolymorphicProps, ark } from '../factory.tsx'
import { useCascadeSelectContext } from './use-cascade-select-context.ts'

export interface CascadeSelectValueTextBaseProps extends PolymorphicProps<'span'> {
  placeholder?: string
}
export interface CascadeSelectValueTextProps extends HTMLProps<'span'>, CascadeSelectValueTextBaseProps {}

/**
 * The `valueAsString`/placeholder text is read from a `noSerialize` api
 * store (R2) -- per R13, it must be rendered as a sibling JSX expression next
 * to an always-claimed empty `<Slot/>`, never as a `<Slot>` fallback (which
 * would go stale across store updates).
 */
export const CascadeSelectValueText = component$<CascadeSelectValueTextProps>((props) => {
  const api = useCascadeSelectContext()
  const record = props as Record<string, unknown>
  const placeholder = record.placeholder as string | undefined

  const rest: Record<string, unknown> = {}
  for (const key in record) {
    if (key !== 'placeholder') rest[key] = record[key]
  }

  const valueTextProps = api ? mergeProps(api.getValueTextProps(), rest) : rest

  return (
    <ark.span {...valueTextProps}>
      {api && !api.hasSelectedItems && placeholder ? placeholder : api?.valueAsString}
      <Slot />
    </ark.span>
  )
})
