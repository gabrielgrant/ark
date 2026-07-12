import { Highlight, type HighlightProps } from '../index.ts'

export const ComponentUnderTest = (props: HighlightProps) => (
  <div data-testid="root">
    <Highlight data-testid="mark" {...props} />
  </div>
)
