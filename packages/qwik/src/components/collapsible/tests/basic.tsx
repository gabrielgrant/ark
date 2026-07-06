import { Collapsible } from '../index.ts'

export const ComponentUnderTest = (props: Collapsible.RootProps) => (
  <Collapsible.Root {...props}>
    <Collapsible.Trigger>Toggle</Collapsible.Trigger>
    <Collapsible.Content data-testid="content">Content</Collapsible.Content>
  </Collapsible.Root>
)
