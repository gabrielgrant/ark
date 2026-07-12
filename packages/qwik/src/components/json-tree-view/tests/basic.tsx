import { JsonTreeView } from '../index.ts'

export const ComponentUnderTest = (props: Partial<JsonTreeView.RootProps>) => (
  <JsonTreeView.Root
    data-testid="root"
    data={{
      name: 'John Doe',
      age: 30,
      tags: ['tag1', 'tag2'],
      address: {
        city: 'Anytown',
      },
    }}
    {...props}
  >
    <JsonTreeView.Tree data-testid="tree" indentGuide />
  </JsonTreeView.Root>
)
