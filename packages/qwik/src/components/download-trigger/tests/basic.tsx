import { DownloadTrigger, type DownloadTriggerProps } from '../index.ts'

export const ComponentUnderTest = (props: Partial<DownloadTriggerProps>) => (
  <DownloadTrigger data-testid="trigger" fileName="hello.txt" mimeType="text/plain" data="hello world" {...props}>
    Download
  </DownloadTrigger>
)
