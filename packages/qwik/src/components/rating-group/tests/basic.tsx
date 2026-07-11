import { RatingGroup } from '../index.ts'

export const ComponentUnderTest = (props: RatingGroup.RootProps) => (
  <RatingGroup.Root {...props}>
    <RatingGroup.Label>Rate us</RatingGroup.Label>
    <RatingGroup.Control data-testid="control">
      {Array.from({ length: 5 }, (_, index) => (
        <RatingGroup.Item key={index} index={index + 1} data-testid={`item-${index + 1}`}>
          {'*'}
        </RatingGroup.Item>
      ))}
    </RatingGroup.Control>
    <RatingGroup.HiddenInput data-testid="hidden-input" />
  </RatingGroup.Root>
)
