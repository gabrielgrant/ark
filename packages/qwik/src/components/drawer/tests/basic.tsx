import { Drawer } from '../index.ts'

export const ComponentUnderTest = (props: Drawer.RootProps) => (
  <Drawer.Root {...props}>
    <Drawer.Trigger data-testid="trigger">Open Drawer</Drawer.Trigger>
    <Drawer.Backdrop data-testid="backdrop" />
    <Drawer.Positioner data-testid="positioner">
      <Drawer.Content data-testid="content">
        <Drawer.Grabber data-testid="grabber">
          <Drawer.GrabberIndicator />
        </Drawer.Grabber>
        <Drawer.Title>Drawer Title</Drawer.Title>
        <Drawer.Description>Drawer Description</Drawer.Description>
        <Drawer.CloseTrigger data-testid="close">Close</Drawer.CloseTrigger>
      </Drawer.Content>
    </Drawer.Positioner>
  </Drawer.Root>
)
