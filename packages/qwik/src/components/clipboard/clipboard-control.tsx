import { mergeProps } from '@zag-js/qwik'
import { Slot, component$ } from '@qwik.dev/core'
import { type HTMLProps, type PolymorphicProps, ark } from '../factory.tsx'
import { useClipboardContext } from './use-clipboard-context.ts'

export interface ClipboardControlBaseProps extends PolymorphicProps<'div'> {}
export interface ClipboardControlProps extends HTMLProps<'div'>, ClipboardControlBaseProps {}

export const ClipboardControl = component$<ClipboardControlProps>((props) => {
  const api = useClipboardContext()
  const controlProps = api ? mergeProps(api.getControlProps(), props) : props

  return (
    <ark.div {...controlProps}>
      <Slot />
    </ark.div>
  )
})
