import type { HiddenInputProps } from '@zag-js/signature-pad'
import { mergeProps } from '@zag-js/qwik'
import { component$ } from '@qwik.dev/core'
import type { Assign } from '../../types.ts'
import { type HTMLProps, type PolymorphicProps, ark } from '../factory.tsx'
import { useFieldContext } from '../field/use-field-context.ts'
import { useSignaturePadContext } from './use-signature-pad-context.ts'

export interface SignaturePadHiddenInputBaseProps extends HiddenInputProps, PolymorphicProps<'input'> {}
export interface SignaturePadHiddenInputProps extends Assign<HTMLProps<'input'>, SignaturePadHiddenInputBaseProps> {}

export const SignaturePadHiddenInput = component$<SignaturePadHiddenInputProps>((props) => {
  const record = props as unknown as Record<string, unknown>
  const hiddenInputProps = { value: record.value as string }

  const api = useSignaturePadContext()
  const field = useFieldContext()

  const rest: Record<string, unknown> = {}
  for (const key in record) {
    if (key !== 'value') rest[key] = record[key]
  }
  if (field?.ariaDescribedby) rest['aria-describedby'] = field.ariaDescribedby

  const inputProps = api ? mergeProps(api.getHiddenInputProps(hiddenInputProps), rest) : rest

  return <ark.input {...inputProps} />
})
