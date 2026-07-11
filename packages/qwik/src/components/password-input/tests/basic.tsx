import { PasswordInput } from '../index.ts'

export const ComponentUnderTest = (props: PasswordInput.RootProps) => (
  <PasswordInput.Root {...props}>
    <PasswordInput.Label>Password</PasswordInput.Label>
    <PasswordInput.Control data-testid="control">
      <PasswordInput.Input data-testid="input" />
      <PasswordInput.VisibilityTrigger data-testid="visibility-trigger">
        <PasswordInput.Indicator data-testid="indicator" fallback="Show">
          Hide
        </PasswordInput.Indicator>
      </PasswordInput.VisibilityTrigger>
    </PasswordInput.Control>
  </PasswordInput.Root>
)
