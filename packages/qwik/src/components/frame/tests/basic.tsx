import { Frame, type FrameProps } from '../index.ts'

export const ComponentUnderTest = (props: Partial<FrameProps>) => (
  <Frame data-testid="frame" {...props}>
    <div data-testid="frame-children">Hello from Frame</div>
  </Frame>
)
