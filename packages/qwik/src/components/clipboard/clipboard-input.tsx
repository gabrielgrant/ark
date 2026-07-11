import { mergeProps } from '@zag-js/qwik'
import { component$ } from '@qwik.dev/core'
import { type HTMLProps, type PolymorphicProps, ark } from '../factory.tsx'
import { useClipboardContext } from './use-clipboard-context.ts'

export interface ClipboardInputBaseProps extends PolymorphicProps<'input'> {}
export interface ClipboardInputProps extends HTMLProps<'input'>, ClipboardInputBaseProps {}

export const ClipboardInput = component$<ClipboardInputProps>((props) => {
  const api = useClipboardContext()
  const inputProps = api ? mergeProps(api.getInputProps(), props as Record<string, unknown>) : props

  return <ark.input {...inputProps} />
})
