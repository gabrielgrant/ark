import { ClientOnly, type ClientOnlyProps } from '../index.ts'

export const ComponentUnderTest = (props: ClientOnlyProps) => (
  <ClientOnly {...props}>
    <div data-testid="client-content">Client-only content</div>
  </ClientOnly>
)
