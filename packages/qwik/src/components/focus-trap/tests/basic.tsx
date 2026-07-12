import { FocusTrap, type FocusTrapProps } from '../index.ts'

export const ComponentUnderTest = (props: Partial<FocusTrapProps>) => (
  <FocusTrap data-testid="trap" {...props}>
    <input data-testid="input-a" type="text" placeholder="a" />
    <input data-testid="input-b" type="text" placeholder="b" />
    <button data-testid="button-c" type="button">
      c
    </button>
  </FocusTrap>
)
