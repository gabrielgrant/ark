import { component$ } from '@qwik.dev/core'
import { FileUpload } from '../index.ts'
import { useFileUploadContext } from '../use-file-upload-context.ts'

/**
 * Solid/React ship a `<FileUpload.Context>` render-prop (or read `api.acceptedFiles`
 * directly) to iterate the machine-computed accepted files. Qwik omits
 * `Context`/`RootProvider` (R6) -- `useFileUploadContext()` is the escape
 * hatch: a small `component$` that reads the store subscribes to it like any
 * other part, so it re-renders whenever `acceptedFiles` changes.
 */
const FileUploadItems = component$(() => {
  const api = useFileUploadContext()

  return (
    <>
      {api?.acceptedFiles.map((file) => (
        <FileUpload.Item key={file.name} file={file} data-testid={`item-${file.name}`}>
          <FileUpload.ItemName data-testid={`item-name-${file.name}`} />
          <FileUpload.ItemSizeText data-testid={`item-size-${file.name}`} />
          <FileUpload.ItemPreview type="image/.*" data-testid={`item-preview-${file.name}`}>
            <FileUpload.ItemPreviewImage data-testid={`item-preview-image-${file.name}`} />
          </FileUpload.ItemPreview>
          <FileUpload.ItemDeleteTrigger data-testid={`item-delete-${file.name}`}>Remove</FileUpload.ItemDeleteTrigger>
        </FileUpload.Item>
      ))}
    </>
  )
})

export const ComponentUnderTest = (props: Partial<FileUpload.RootProps>) => (
  <FileUpload.Root maxFiles={5} {...props}>
    <FileUpload.Label data-testid="label">File Upload</FileUpload.Label>
    <FileUpload.Dropzone data-testid="dropzone">Drop files here</FileUpload.Dropzone>
    <FileUpload.Trigger data-testid="trigger">Choose file(s)</FileUpload.Trigger>
    <FileUpload.ClearTrigger data-testid="clear-trigger">Clear</FileUpload.ClearTrigger>
    <FileUpload.ItemGroup data-testid="item-group">
      <FileUploadItems />
    </FileUpload.ItemGroup>
    <FileUpload.HiddenInput data-testid="hidden-input" />
  </FileUpload.Root>
)
