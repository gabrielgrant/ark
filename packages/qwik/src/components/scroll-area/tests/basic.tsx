import { ScrollArea } from '../index.ts'

export const ComponentUnderTest = (props: Partial<ScrollArea.RootProps>) => (
  <ScrollArea.Root data-testid="root" style={{ width: '200px', height: '200px' }} {...props}>
    <ScrollArea.Viewport data-testid="viewport">
      <ScrollArea.Content data-testid="content">
        {Array.from({ length: 50 }, (_, index) => (
          <div key={index} data-testid={`row-${index}`}>
            Row {index}
          </div>
        ))}
      </ScrollArea.Content>
    </ScrollArea.Viewport>
    <ScrollArea.Scrollbar orientation="vertical" data-testid="scrollbar-vertical">
      <ScrollArea.Thumb data-testid="thumb-vertical" />
    </ScrollArea.Scrollbar>
    <ScrollArea.Scrollbar orientation="horizontal" data-testid="scrollbar-horizontal">
      <ScrollArea.Thumb data-testid="thumb-horizontal" />
    </ScrollArea.Scrollbar>
    <ScrollArea.Corner data-testid="corner" />
  </ScrollArea.Root>
)
