import { PinInput } from '../index.ts'

export const ComponentUnderTest = (props: PinInput.RootProps) => (
  <PinInput.Root {...props}>
    <PinInput.Label>Enter code</PinInput.Label>
    <PinInput.Control data-testid="control">
      <PinInput.Input index={0} data-testid="input-0" />
      <PinInput.Input index={1} data-testid="input-1" />
      <PinInput.Input index={2} data-testid="input-2" />
    </PinInput.Control>
    <PinInput.HiddenInput data-testid="hidden-input" />
  </PinInput.Root>
)
