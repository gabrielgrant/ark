import { Steps } from '../index.ts'

const items = [
  { title: 'First', description: 'Contact Info' },
  { title: 'Second', description: 'Date & Time' },
  { title: 'Third', description: 'Select Rooms' },
]

export const ComponentUnderTest = (props: Steps.RootProps) => (
  <Steps.Root data-testid="root" count={items.length} {...props}>
    <Steps.List data-testid="list">
      {items.map((item, index) => (
        <Steps.Item key={item.title} data-testid={`item-${index}`} index={index}>
          <Steps.Trigger data-testid={`trigger-${index}`}>
            <Steps.Indicator data-testid={`indicator-${index}`}>{index + 1}</Steps.Indicator>
            <span>{item.title}</span>
          </Steps.Trigger>
          <Steps.Separator data-testid={`separator-${index}`} />
        </Steps.Item>
      ))}
    </Steps.List>

    {items.map((item, index) => (
      <Steps.Content key={item.title} data-testid={`content-${index}`} index={index}>
        {item.title} - {item.description}
      </Steps.Content>
    ))}

    <Steps.CompletedContent data-testid="completed-content">
      Steps Complete - Thank you for filling out the form!
    </Steps.CompletedContent>

    <div>
      <Steps.PrevTrigger data-testid="prev-trigger">Back</Steps.PrevTrigger>
      <Steps.NextTrigger data-testid="next-trigger">Next</Steps.NextTrigger>
    </div>

    <Steps.Progress data-testid="progress" />
  </Steps.Root>
)
