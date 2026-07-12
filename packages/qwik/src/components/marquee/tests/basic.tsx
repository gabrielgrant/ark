import { Marquee } from '../index.ts'

export const ComponentUnderTest = (props: Partial<Marquee.RootProps>) => (
  <Marquee.Root data-testid="root" {...props}>
    <Marquee.Viewport data-testid="viewport">
      <Marquee.Content data-testid="content">
        <Marquee.Item data-testid="item-0">One</Marquee.Item>
        <Marquee.Item data-testid="item-1">Two</Marquee.Item>
      </Marquee.Content>
    </Marquee.Viewport>
    <Marquee.Edge side="start" data-testid="edge-start" />
    <Marquee.Edge side="end" data-testid="edge-end" />
  </Marquee.Root>
)
