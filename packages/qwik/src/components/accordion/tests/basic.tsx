import { Accordion } from '../index.ts'

const items = ['React', 'Solid', 'Vue']

export const ComponentUnderTest = (props: Accordion.RootProps) => (
  <Accordion.Root {...props}>
    {items.map((item) => (
      <Accordion.Item key={item} value={item} data-testid={`item-${item}`}>
        <Accordion.ItemTrigger data-testid={`trigger-${item}`}>
          {item}
          <Accordion.ItemIndicator data-testid={`indicator-${item}`}>{'>'}</Accordion.ItemIndicator>
        </Accordion.ItemTrigger>
        <Accordion.ItemContent data-testid={`content-${item}`}>{`Content for ${item}`}</Accordion.ItemContent>
      </Accordion.Item>
    ))}
  </Accordion.Root>
)
