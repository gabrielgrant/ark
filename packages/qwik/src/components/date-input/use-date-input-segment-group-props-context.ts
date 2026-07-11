import type { SegmentGroupProps } from '@zag-js/date-input'
import { createContext } from '../../utils/create-context.ts'

export interface UseDateInputSegmentGroupPropsContext extends SegmentGroupProps {}

export const [DateInputSegmentGroupPropsProvider, useDateInputSegmentGroupPropsContext] =
  createContext<UseDateInputSegmentGroupPropsContext>({
    name: 'ark.date-input.segment-group-props',
    hookName: 'useDateInputSegmentGroupPropsContext',
    providerName: '<DateInput.SegmentGroup />',
    strict: true,
  })
