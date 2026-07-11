import { Clipboard } from '../index.ts'

export const ComponentUnderTest = (props: Clipboard.RootProps) => (
  <Clipboard.Root {...props}>
    <Clipboard.Label>Copy this link</Clipboard.Label>
    <Clipboard.Control data-testid="control">
      <Clipboard.Input data-testid="input" />
      <Clipboard.Trigger data-testid="trigger">
        <Clipboard.Indicator copied={<span data-testid="copied-icon">Copied</span>}>
          <span data-testid="copy-icon">Copy</span>
        </Clipboard.Indicator>
      </Clipboard.Trigger>
    </Clipboard.Control>
    <Clipboard.ValueText data-testid="value-text" />
  </Clipboard.Root>
)
