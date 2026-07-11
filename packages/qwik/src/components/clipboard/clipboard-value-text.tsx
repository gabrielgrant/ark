import { Slot, component$ } from '@qwik.dev/core'
import { type HTMLProps, type PolymorphicProps, ark } from '../factory.tsx'
import { useClipboardContext } from './use-clipboard-context.ts'

export interface ClipboardValueTextBaseProps extends PolymorphicProps<'span'> {}
export interface ClipboardValueTextProps extends HTMLProps<'span'>, ClipboardValueTextBaseProps {}

export const ClipboardValueText = component$<ClipboardValueTextProps>((props) => {
  const api = useClipboardContext()

  // rule R13: render the derived value as a sibling expression next to an
  // always-claimed empty Slot, not as a Slot fallback (which goes stale — the
  // value reads a noSerialize store, see PLAN.md).
  return (
    <ark.span {...props}>
      {api?.value}
      <Slot />
    </ark.span>
  )
})
