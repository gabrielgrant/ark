import { HoverCard } from '../index.ts'

export const ComponentUnderTest = (props: HoverCard.RootProps) => (
  <HoverCard.Root {...props}>
    <HoverCard.Trigger data-testid="trigger">Hover me</HoverCard.Trigger>
    <HoverCard.Positioner data-testid="positioner">
      <HoverCard.Content data-testid="content">
        <HoverCard.Arrow data-testid="arrow">
          <HoverCard.ArrowTip data-testid="arrow-tip" />
        </HoverCard.Arrow>
        Hover card content
      </HoverCard.Content>
    </HoverCard.Positioner>
  </HoverCard.Root>
)
