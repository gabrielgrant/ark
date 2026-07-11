import { NumberInput } from '../index.ts'

export const ComponentUnderTest = (props: NumberInput.RootProps) => (
  <NumberInput.Root {...props}>
    <NumberInput.Label>
      Quantity: <NumberInput.ValueText data-testid="value-text" />
    </NumberInput.Label>
    <NumberInput.Control data-testid="control">
      <NumberInput.DecrementTrigger data-testid="decrement">-</NumberInput.DecrementTrigger>
      <NumberInput.Input data-testid="input" />
      <NumberInput.IncrementTrigger data-testid="increment">+</NumberInput.IncrementTrigger>
    </NumberInput.Control>
    <NumberInput.Scrubber data-testid="scrubber" />
  </NumberInput.Root>
)
