import { Popover } from '../index.ts'

export const ComponentUnderTest = (props: Popover.RootProps) => (
  <Popover.Root {...props}>
    <Popover.Trigger data-testid="trigger">
      Click me
      <Popover.Indicator data-testid="indicator">{'>'}</Popover.Indicator>
    </Popover.Trigger>
    <Popover.Anchor data-testid="anchor">anchor</Popover.Anchor>
    <Popover.Positioner data-testid="positioner">
      <Popover.Content data-testid="content">
        <Popover.Arrow data-testid="arrow">
          <Popover.ArrowTip data-testid="arrow-tip" />
        </Popover.Arrow>
        <Popover.Title data-testid="title">Popover Title</Popover.Title>
        <Popover.Description data-testid="description">Popover Description</Popover.Description>
        <Popover.CloseTrigger data-testid="close-trigger">Close</Popover.CloseTrigger>
      </Popover.Content>
    </Popover.Positioner>
  </Popover.Root>
)
