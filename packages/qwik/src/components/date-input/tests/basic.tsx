import { DateInput } from '../index.ts'

export const ComponentUnderTest = (props: DateInput.RootProps) => (
  <DateInput.Root {...props}>
    <DateInput.Label>Date</DateInput.Label>
    <DateInput.Control data-testid="control">
      <DateInput.SegmentGroup data-testid="segment-group" />
    </DateInput.Control>
    <DateInput.HiddenInput data-testid="hidden-input" />
  </DateInput.Root>
)
