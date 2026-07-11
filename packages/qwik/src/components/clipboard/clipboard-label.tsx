import { mergeProps } from '@zag-js/qwik'
import { Slot, component$ } from '@qwik.dev/core'
import { type HTMLProps, type PolymorphicProps, ark } from '../factory.tsx'
import { useClipboardContext } from './use-clipboard-context.ts'

export interface ClipboardLabelBaseProps extends PolymorphicProps<'label'> {}
export interface ClipboardLabelProps extends HTMLProps<'label'>, ClipboardLabelBaseProps {}

export const ClipboardLabel = component$<ClipboardLabelProps>((props) => {
  const api = useClipboardContext()
  const labelProps = api ? mergeProps(api.getLabelProps(), props) : props

  return (
    <ark.label {...labelProps}>
      <Slot />
    </ark.label>
  )
})
