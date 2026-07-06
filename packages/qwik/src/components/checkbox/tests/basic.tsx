import { Checkbox } from '../index.ts'

export const ComponentUnderTest = (props: Checkbox.RootProps) => (
  <Checkbox.Root {...props}>
    <Checkbox.Label>Checkbox</Checkbox.Label>
    <Checkbox.Control data-testid="control">
      <Checkbox.Indicator>✓</Checkbox.Indicator>
    </Checkbox.Control>
    <Checkbox.HiddenInput />
  </Checkbox.Root>
)
