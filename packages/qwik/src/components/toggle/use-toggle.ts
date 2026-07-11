import { type PropTypes, normalizeProps, useMachine } from '@zag-js/qwik'
import * as toggle from '@zag-js/toggle'

export interface UseToggleProps extends toggle.Props {}
export interface UseToggleReturn extends toggle.Api<PropTypes> {}

export const useToggle = (props: () => UseToggleProps): UseToggleReturn => {
  const service = useMachine(toggle.machine, () => props() as toggle.Props)
  return toggle.connect(service, normalizeProps)
}
