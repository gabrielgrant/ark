import { QrCode } from '../index.ts'

export const ComponentUnderTest = (props: QrCode.RootProps) => (
  <QrCode.Root data-testid="root" {...props}>
    <QrCode.Frame data-testid="frame">
      <QrCode.Pattern data-testid="pattern" />
    </QrCode.Frame>
    <QrCode.Overlay data-testid="overlay">
      <span data-testid="overlay-content">logo</span>
    </QrCode.Overlay>
    <QrCode.DownloadTrigger data-testid="download-trigger" fileName="qr-code.png" mimeType="image/png">
      Download
    </QrCode.DownloadTrigger>
  </QrCode.Root>
)
