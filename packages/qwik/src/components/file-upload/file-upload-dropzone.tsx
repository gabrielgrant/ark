import type { DropzoneProps } from '@zag-js/file-upload'
import { mergeProps } from '@zag-js/qwik'
import { Slot, component$ } from '@qwik.dev/core'
import type { Assign } from '../../types.ts'
import { type HTMLProps, type PolymorphicProps, ark } from '../factory.tsx'
import { useFileUploadContext } from './use-file-upload-context.ts'

const dropzonePropKeys = ['disableClick'] as const

const ownKeySet = new Set<string>(dropzonePropKeys)

export interface FileUploadDropzoneBaseProps extends PolymorphicProps<'div'>, DropzoneProps {}
export interface FileUploadDropzoneProps extends Assign<HTMLProps<'div'>, FileUploadDropzoneBaseProps> {}

export const FileUploadDropzone = component$<FileUploadDropzoneProps>((props) => {
  const record = props as unknown as Record<string, unknown>

  const dropzoneProps = {} as DropzoneProps
  for (const key of dropzonePropKeys) {
    if (key in record) (dropzoneProps as unknown as Record<string, unknown>)[key] = record[key]
  }

  const api = useFileUploadContext()

  const rest: Record<string, unknown> = {}
  for (const key in record) {
    if (!ownKeySet.has(key)) rest[key] = record[key]
  }

  const dropzoneDivProps = api ? mergeProps(api.getDropzoneProps(dropzoneProps), rest) : rest

  return (
    <ark.div {...dropzoneDivProps}>
      <Slot />
    </ark.div>
  )
})
