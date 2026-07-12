import { SignaturePad } from '../index.ts'

export interface ComponentUnderTestProps extends Partial<SignaturePad.RootProps> {
  hiddenInputValue?: string
}

export const ComponentUnderTest = ({ hiddenInputValue, ...props }: ComponentUnderTestProps) => (
  <SignaturePad.Root {...props}>
    <SignaturePad.Label data-testid="label">Signature</SignaturePad.Label>
    <SignaturePad.Control data-testid="control">
      <SignaturePad.Segment data-testid="segment" />
      <SignaturePad.Guide data-testid="guide" />
      <SignaturePad.ClearTrigger data-testid="clear-trigger">Clear</SignaturePad.ClearTrigger>
    </SignaturePad.Control>
    <SignaturePad.HiddenInput data-testid="hidden-input" value={hiddenInputValue ?? ''} />
  </SignaturePad.Root>
)
