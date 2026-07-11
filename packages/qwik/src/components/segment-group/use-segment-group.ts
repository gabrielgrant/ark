import * as segmentGroup from '@zag-js/radio-group'
import { type PropTypes, normalizeProps, useMachine } from '@zag-js/qwik'
import { useId } from '@qwik.dev/core'
import { useEnvironmentContext } from '../../providers/environment/index.ts'
import { useLocaleContext } from '../../providers/locale/index.ts'
import type { Optional } from '../../types.ts'

export interface UseSegmentGroupProps extends Optional<Omit<segmentGroup.Props, 'dir' | 'getRootNode'>, 'id'> {}
export interface UseSegmentGroupReturn extends segmentGroup.Api<PropTypes> {}

export const useSegmentGroup = (props: () => UseSegmentGroupProps): UseSegmentGroupReturn => {
  const id = useId()
  const env = useEnvironmentContext()
  const locale = useLocaleContext()

  const service = useMachine(
    segmentGroup.machine,
    () =>
      ({
        id,
        dir: locale.dir,
        getRootNode: env.getRootNode,
        ...props(),
      }) as segmentGroup.Props,
  )

  return segmentGroup.connect(service, normalizeProps)
}
