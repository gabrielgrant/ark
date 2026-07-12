import { mergeProps } from '@zag-js/qwik'
import { component$ } from '@qwik.dev/core'
import { type HTMLProps, type PolymorphicProps, ark } from '../factory.tsx'
import { useFieldContext } from '../field/use-field-context.ts'
import { useFileUploadContext } from './use-file-upload-context.ts'

export interface FileUploadHiddenInputBaseProps extends PolymorphicProps<'input'> {}
export interface FileUploadHiddenInputProps extends HTMLProps<'input'>, FileUploadHiddenInputBaseProps {}

export const FileUploadHiddenInput = component$<FileUploadHiddenInputProps>((props) => {
  const api = useFileUploadContext()
  const field = useFieldContext()
  const describedBy: Record<string, unknown> = field?.ariaDescribedby
    ? { 'aria-describedby': field.ariaDescribedby }
    : {}
  const inputProps = api
    ? mergeProps(api.getHiddenInputProps(), describedBy, props as Record<string, unknown>)
    : props

  return <ark.input {...inputProps} />
})
