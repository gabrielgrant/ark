import { SegmentGroup } from '../index.ts'

const frameworks = ['React', 'Solid', 'Vue']

export const ComponentUnderTest = (props: SegmentGroup.RootProps) => (
  <SegmentGroup.Root {...props}>
    <SegmentGroup.Label>Framework</SegmentGroup.Label>
    {frameworks.map((framework) => (
      <SegmentGroup.Item key={framework} value={framework} data-testid={`item-${framework}`}>
        <SegmentGroup.ItemText>{framework}</SegmentGroup.ItemText>
        <SegmentGroup.ItemControl data-testid={`control-${framework}`} />
        <SegmentGroup.ItemHiddenInput data-testid={`input-${framework}`} />
      </SegmentGroup.Item>
    ))}
    <SegmentGroup.Indicator data-testid="indicator" />
  </SegmentGroup.Root>
)
