import { Progress } from '../index.ts'

export const ComponentUnderTest = (props: Progress.RootProps) => (
  <Progress.Root data-testid="root" {...props}>
    <Progress.Label>Loading</Progress.Label>
    <Progress.Track data-testid="track">
      <Progress.Range data-testid="range" />
    </Progress.Track>
    <Progress.ValueText data-testid="value-text" />
  </Progress.Root>
)

export const ComponentUnderTestCircular = (props: Progress.RootProps) => (
  <Progress.Root data-testid="root" {...props}>
    <Progress.Label>Loading</Progress.Label>
    <Progress.Circle data-testid="circle">
      <Progress.CircleTrack data-testid="circle-track" />
      <Progress.CircleRange data-testid="circle-range" />
    </Progress.Circle>
    <Progress.ValueText data-testid="value-text" />
  </Progress.Root>
)
