import { FloatingPanel } from '../index.ts'

export const ComponentUnderTest = (props: FloatingPanel.RootProps) => (
  <FloatingPanel.Root {...props}>
    <FloatingPanel.Trigger data-testid="trigger">Toggle Panel</FloatingPanel.Trigger>
    <FloatingPanel.Positioner data-testid="positioner">
      <FloatingPanel.Content data-testid="content">
        <FloatingPanel.DragTrigger data-testid="drag-trigger">
          <FloatingPanel.Header data-testid="header">
            <FloatingPanel.Title>Floating Panel</FloatingPanel.Title>
            <FloatingPanel.Control data-testid="control">
              <FloatingPanel.StageTrigger data-testid="stage-min" stage="minimized">
                Minimize
              </FloatingPanel.StageTrigger>
              <FloatingPanel.StageTrigger data-testid="stage-max" stage="maximized">
                Maximize
              </FloatingPanel.StageTrigger>
              <FloatingPanel.StageTrigger data-testid="stage-default" stage="default">
                Restore
              </FloatingPanel.StageTrigger>
              <FloatingPanel.CloseTrigger data-testid="close">Close</FloatingPanel.CloseTrigger>
            </FloatingPanel.Control>
          </FloatingPanel.Header>
        </FloatingPanel.DragTrigger>
        <FloatingPanel.Body data-testid="body">Some content</FloatingPanel.Body>
        <FloatingPanel.ResizeTrigger data-testid="resize-e" axis="e" />
      </FloatingPanel.Content>
    </FloatingPanel.Positioner>
  </FloatingPanel.Root>
)
