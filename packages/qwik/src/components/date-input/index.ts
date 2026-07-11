export type {
  DateValue as DateInputDateValue,
  FocusChangeDetails as DateInputFocusChangeDetails,
  PlaceholderChangeDetails as DateInputPlaceholderChangeDetails,
  SelectionMode as DateInputSelectionMode,
  ValueChangeDetails as DateInputValueChangeDetails,
} from '@zag-js/date-input'
export { DateInputControl, type DateInputControlBaseProps, type DateInputControlProps } from './date-input-control.tsx'
export {
  DateInputHiddenInput,
  type DateInputHiddenInputBaseProps,
  type DateInputHiddenInputProps,
} from './date-input-hidden-input.tsx'
export { DateInputLabel, type DateInputLabelBaseProps, type DateInputLabelProps } from './date-input-label.tsx'
export { DateInputRoot, type DateInputRootBaseProps, type DateInputRootProps } from './date-input-root.tsx'
export { DateInputSegment, type DateInputSegmentBaseProps, type DateInputSegmentProps } from './date-input-segment.tsx'
export {
  DateInputSegmentGroup,
  type DateInputSegmentGroupBaseProps,
  type DateInputSegmentGroupProps,
} from './date-input-segment-group.tsx'
export { dateInputAnatomy } from './date-input.anatomy.ts'
export { useDateInput, type UseDateInputProps, type UseDateInputReturn } from './use-date-input.ts'
export { useDateInputContext, type UseDateInputContext } from './use-date-input-context.ts'
export {
  useDateInputSegmentGroupPropsContext,
  type UseDateInputSegmentGroupPropsContext,
} from './use-date-input-segment-group-props-context.ts'

export * as DateInput from './date-input.ts'
