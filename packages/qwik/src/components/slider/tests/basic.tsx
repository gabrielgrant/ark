import { Slider } from '../index.ts'

export const ComponentUnderTest = (props: Slider.RootProps) => (
  <Slider.Root {...props}>
    <Slider.Label>Volume</Slider.Label>
    <Slider.ValueText data-testid="value-text" />
    <Slider.Control data-testid="control" style={{ position: 'relative', width: '200px' }}>
      <Slider.Track data-testid="track">
        <Slider.Range data-testid="range" />
      </Slider.Track>
      <Slider.Thumb
        index={0}
        data-testid="thumb-0"
        style={{ width: '20px', height: '20px', display: 'block' }}
      >
        <Slider.HiddenInput />
      </Slider.Thumb>
    </Slider.Control>
    <Slider.MarkerGroup data-testid="marker-group">
      <Slider.Marker value={25} data-testid="marker-25">
        {'*'}
      </Slider.Marker>
      <Slider.Marker value={75} data-testid="marker-75">
        {'*'}
      </Slider.Marker>
    </Slider.MarkerGroup>
  </Slider.Root>
)
