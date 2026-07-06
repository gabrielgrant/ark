import { Switch } from '../index.ts'

export const ComponentUnderTest = (props: Switch.RootProps) => (
  <Switch.Root {...props}>
    <Switch.Control data-testid="control">
      <Switch.Thumb />
    </Switch.Control>
    <Switch.Label>Label</Switch.Label>
    <Switch.HiddenInput />
  </Switch.Root>
)
