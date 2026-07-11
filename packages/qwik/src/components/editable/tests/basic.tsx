import { Editable } from '../index.ts'

export const ComponentUnderTest = (props: Editable.RootProps) => (
  <Editable.Root {...props}>
    <Editable.Label>Name</Editable.Label>
    <Editable.Area data-testid="area">
      <Editable.Input data-testid="input" />
      <Editable.Preview data-testid="preview" />
    </Editable.Area>
    <Editable.Control data-testid="control">
      <Editable.EditTrigger data-testid="edit-trigger">Edit</Editable.EditTrigger>
      <Editable.SubmitTrigger data-testid="submit-trigger">Save</Editable.SubmitTrigger>
      <Editable.CancelTrigger data-testid="cancel-trigger">Cancel</Editable.CancelTrigger>
    </Editable.Control>
  </Editable.Root>
)
