import { mergeProps } from '@zag-js/qwik'
import { component$, useSignal, useVisibleTask$ } from '@qwik.dev/core'
import { type HTMLProps, type PolymorphicProps, ark } from '../factory.tsx'
import { useFileUploadContext } from './use-file-upload-context.ts'
import { useFileUploadItemPropsContext } from './use-file-upload-item-props-context.ts'

export interface FileUploadItemPreviewImageBaseProps extends PolymorphicProps<'img'> {}
export interface FileUploadItemPreviewImageProps extends HTMLProps<'img'>, FileUploadItemPreviewImageBaseProps {}

/**
 * `createFileUrl` (`URL.createObjectURL` + a revoke cleanup) is a
 * browser-only operation, so it runs from a `useVisibleTask$` (client only,
 * per R5's `isBrowser`-gated adapter behavior) rather than at render time.
 * `document-ready` avoids the IntersectionObserver-anchor requirement for a
 * component that may render nothing (no `<img>`) until the task resolves the
 * object URL.
 */
export const FileUploadItemPreviewImage = component$<FileUploadItemPreviewImageProps>((props) => {
  const api = useFileUploadContext()
  const itemProps = useFileUploadItemPropsContext()
  const url = useSignal('')

  // biome-ignore lint/correctness/noQwikUseVisibleTask: URL.createObjectURL is a real browser-only API with no SSR-safe alternative; this is not avoidable non-interactive initialization
  useVisibleTask$(
    ({ cleanup }) => {
      if (!api) return
      const revoke = api.createFileUrl(itemProps.file, (nextUrl) => {
        url.value = nextUrl
      })
      cleanup(revoke)
    },
    { strategy: 'document-ready' },
  )

  if (!url.value) return null

  const previewImageProps = api
    ? mergeProps(api.getItemPreviewImageProps({ ...itemProps, url: url.value }), props)
    : props

  // biome-ignore lint/correctness/useImageSize: headless component; sizing is the consumer's concern
  return <ark.img {...previewImageProps} />
})
