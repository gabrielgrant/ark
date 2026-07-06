import { Dialog } from '../index.ts'

export const ComponentUnderTest = (props: Dialog.RootProps) => (
  <Dialog.Root {...props}>
    <Dialog.Trigger>Open Dialog</Dialog.Trigger>
    <Dialog.Backdrop data-testid="backdrop" />
    <Dialog.Positioner data-testid="positioner">
      <Dialog.Content data-testid="content">
        <Dialog.Title>Dialog Title</Dialog.Title>
        <Dialog.Description>Dialog Description</Dialog.Description>
        <Dialog.CloseTrigger>Close</Dialog.CloseTrigger>
      </Dialog.Content>
    </Dialog.Positioner>
  </Dialog.Root>
)
