import { mergeProps } from '@zag-js/qwik'
import { component$ } from '@qwik.dev/core'
import { type HTMLProps, type PolymorphicProps, ark } from '../factory.tsx'
import { useFieldContext } from './use-field-context.ts'

export interface FieldTextareaBaseProps extends PolymorphicProps<'textarea'> {}
export interface FieldTextareaProps extends HTMLProps<'textarea'>, FieldTextareaBaseProps {}

/**
 * NOTE: the other frameworks support an `autoresize` prop (via
 * @zag-js/auto-resize). Deferred here — needs a client task wiring the
 * element signal to autoresizeTextarea. Tracked in PLAN Part 4.
 */
export const FieldTextarea = component$<FieldTextareaProps>((props) => {
  const api = useFieldContext()
  const textareaProps = api ? mergeProps(api.getTextareaProps(), props as Record<string, unknown>) : props

  return <ark.textarea {...textareaProps} />
})
