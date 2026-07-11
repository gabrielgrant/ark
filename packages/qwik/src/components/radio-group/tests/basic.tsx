import { RadioGroup } from '../index.ts'

const frameworks = ['React', 'Solid', 'Vue']

export const ComponentUnderTest = (props: RadioGroup.RootProps) => (
  <RadioGroup.Root {...props}>
    <RadioGroup.Label>Framework</RadioGroup.Label>
    {frameworks.map((framework) => (
      <RadioGroup.Item key={framework} value={framework} data-testid={`item-${framework}`}>
        <RadioGroup.ItemControl data-testid={`control-${framework}`} />
        <RadioGroup.ItemText>{framework}</RadioGroup.ItemText>
        <RadioGroup.ItemHiddenInput data-testid={`input-${framework}`} />
      </RadioGroup.Item>
    ))}
    <RadioGroup.Indicator data-testid="indicator" />
  </RadioGroup.Root>
)
