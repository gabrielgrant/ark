import { Tooltip } from '../index.ts'

export const ComponentUnderTest = (props: Tooltip.RootProps) => (
  <Tooltip.Root {...props}>
    <Tooltip.Trigger data-testid="trigger">Hover me</Tooltip.Trigger>
    <Tooltip.Positioner data-testid="positioner">
      <Tooltip.Content data-testid="content">
        <Tooltip.Arrow data-testid="arrow">
          <Tooltip.ArrowTip data-testid="arrow-tip" />
        </Tooltip.Arrow>
        Tooltip content
      </Tooltip.Content>
    </Tooltip.Positioner>
  </Tooltip.Root>
)
