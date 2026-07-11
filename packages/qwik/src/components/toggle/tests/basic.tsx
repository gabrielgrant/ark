import { Toggle } from '../index.ts'

export const ComponentUnderTest = (props: Toggle.RootProps) => (
  <Toggle.Root data-testid="root" {...props}>
    <Toggle.Indicator data-testid="indicator" fallback="Off">
      On
    </Toggle.Indicator>
  </Toggle.Root>
)
