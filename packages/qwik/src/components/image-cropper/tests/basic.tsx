import { ImageCropper } from '../index.ts'

// A tiny inline 4x3 red PNG -- keeps the fixture offline/deterministic (no
// network fetch) while still exercising the real `<img onLoad>` -> natural
// size -> measured-selection pipeline.
const SAMPLE_IMAGE_SRC =
  'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAQAAAADCAYAAABWKLW/AAAAEUlEQVR42mNk+M9QDwAEXAJ4Ubs5FQAAAABJRU5ErkJggg=='

export const ComponentUnderTest = (props: Partial<ImageCropper.RootProps>) => (
  <ImageCropper.Root data-testid="root" {...props}>
    <ImageCropper.Viewport data-testid="viewport" style={{ width: '200px', height: '150px' }}>
      <ImageCropper.Image data-testid="image" src={SAMPLE_IMAGE_SRC} alt="Sample" />
      <ImageCropper.Selection data-testid="selection">
        {ImageCropper.handles.map((position) => (
          <ImageCropper.Handle key={position} position={position} data-testid={`handle-${position}`} />
        ))}
        <ImageCropper.Grid axis="horizontal" data-testid="grid-horizontal" />
        <ImageCropper.Grid axis="vertical" data-testid="grid-vertical" />
      </ImageCropper.Selection>
    </ImageCropper.Viewport>
  </ImageCropper.Root>
)
