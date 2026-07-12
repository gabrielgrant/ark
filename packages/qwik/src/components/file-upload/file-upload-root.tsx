import { mergeProps } from '@zag-js/qwik'
import type { FileAcceptDetails, FileChangeDetails, FileRejectDetails } from '@zag-js/file-upload'
import { type QRL, Slot, component$, noSerialize } from '@qwik.dev/core'
import type { Assign } from '../../types.ts'
import { useApiStore } from '../../utils/use-api-store.ts'
import { type HTMLProps, type PolymorphicProps, ark } from '../factory.tsx'
import { FileUploadProvider } from './use-file-upload-context.ts'
import { type UseFileUploadProps, useFileUpload } from './use-file-upload.ts'

const machinePropKeys = [
  'accept',
  'acceptedFiles',
  'allowDrop',
  'capture',
  'defaultAcceptedFiles',
  'directory',
  'disabled',
  'id',
  'ids',
  'invalid',
  'locale',
  'maxFiles',
  'maxFileSize',
  'minFileSize',
  'name',
  'preventDocumentDrop',
  'readOnly',
  'required',
  'translations',
  'transformFiles',
  'validate',
] as const

const ownKeySet = new Set<string>([...machinePropKeys, 'onFileAccept$', 'onFileChange$', 'onFileReject$'])

/**
 * R12: `validate` (returns `FileError[] | null`, consumed synchronously by
 * the machine) and `transformFiles` (its `Promise<File[]>` result is awaited
 * and the resolved files replace the accepted set) stay plain-function-only
 * -- there is exactly one implementation the machine calls, so unlike the
 * notification callbacks below there is no "compose both" QRL variant to
 * offer.
 */
export interface FileUploadRootBaseProps extends UseFileUploadProps, PolymorphicProps<'div'> {
  /**
   * QRL variant of `onFileChange`. Prefer this in Qwik apps: plain function
   * props cannot be serialized when the component is server-rendered.
   */
  onFileChange$?: QRL<(details: FileChangeDetails) => void>
  /** QRL variant of `onFileAccept`. */
  onFileAccept$?: QRL<(details: FileAcceptDetails) => void>
  /** QRL variant of `onFileReject`. */
  onFileReject$?: QRL<(details: FileRejectDetails) => void>
}
export interface FileUploadRootProps extends Assign<HTMLProps<'div'>, FileUploadRootBaseProps> {}

export const FileUploadRoot = component$<FileUploadRootProps>((props) => {
  const record = props as unknown as Record<string, unknown>

  /**
   * `acceptedFiles`/`defaultAcceptedFiles` carry `File` class instances --
   * Qwik would otherwise try (and fail, Q20) to serialize them as part of
   * this component's own SSR-resumable prop state. `noSerialize()` tags the
   * SAME array referenced by the prop (R15, same pattern as listbox's
   * `collection`); after a true SSR-serialize-then-resume round trip the
   * value would come back `undefined` per `noSerialize`'s documented
   * contract -- the same class of gap as the already-documented wake-path
   * limitation (PLAN.md Part 5 #1), not a new one.
   */
  if (Array.isArray(record.acceptedFiles)) noSerialize(record.acceptedFiles)
  if (Array.isArray(record.defaultAcceptedFiles)) noSerialize(record.defaultAcceptedFiles)

  const api = useFileUpload(() => {
    const machineProps: Record<string, unknown> = {}
    for (const key of machinePropKeys) {
      if (key in record) machineProps[key] = record[key]
    }

    const plainChange = record.onFileChange as ((details: FileChangeDetails) => void) | undefined
    const qrlChange = record.onFileChange$ as QRL<(details: FileChangeDetails) => void> | undefined
    if (plainChange || qrlChange) {
      machineProps.onFileChange = (details: FileChangeDetails) => {
        plainChange?.(details)
        void qrlChange?.(details)
      }
    }

    const plainAccept = record.onFileAccept as ((details: FileAcceptDetails) => void) | undefined
    const qrlAccept = record.onFileAccept$ as QRL<(details: FileAcceptDetails) => void> | undefined
    if (plainAccept || qrlAccept) {
      machineProps.onFileAccept = (details: FileAcceptDetails) => {
        plainAccept?.(details)
        void qrlAccept?.(details)
      }
    }

    const plainReject = record.onFileReject as ((details: FileRejectDetails) => void) | undefined
    const qrlReject = record.onFileReject$ as QRL<(details: FileRejectDetails) => void> | undefined
    if (plainReject || qrlReject) {
      machineProps.onFileReject = (details: FileRejectDetails) => {
        plainReject?.(details)
        void qrlReject?.(details)
      }
    }

    return machineProps as UseFileUploadProps
  })

  const store = useApiStore(api)
  FileUploadProvider(store)

  const rest: Record<string, unknown> = {}
  for (const key in record) {
    if (!ownKeySet.has(key)) rest[key] = record[key]
  }

  const rootProps = mergeProps(api.getRootProps(), rest)

  return (
    <ark.div {...rootProps}>
      <Slot />
    </ark.div>
  )
})
