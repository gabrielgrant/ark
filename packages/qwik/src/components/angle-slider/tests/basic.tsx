import { AngleSlider } from '../index.ts'

export const ComponentUnderTest = (props: AngleSlider.RootProps) => (
  <AngleSlider.Root {...props}>
    <AngleSlider.Label>Direction</AngleSlider.Label>
    <AngleSlider.ValueText data-testid="value-text" />
    <AngleSlider.Control data-testid="control" style={{ position: 'relative', width: '100px', height: '100px' }}>
      <AngleSlider.Thumb data-testid="thumb" style={{ width: '16px', height: '16px', display: 'block' }} />
      <AngleSlider.MarkerGroup data-testid="marker-group">
        <AngleSlider.Marker value={0} data-testid="marker-0">
          {'*'}
        </AngleSlider.Marker>
        <AngleSlider.Marker value={180} data-testid="marker-180">
          {'*'}
        </AngleSlider.Marker>
      </AngleSlider.MarkerGroup>
    </AngleSlider.Control>
    <AngleSlider.HiddenInput />
  </AngleSlider.Root>
)
