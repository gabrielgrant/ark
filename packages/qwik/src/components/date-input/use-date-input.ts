import * as dateInput from '@zag-js/date-input'
import { type PropTypes, normalizeProps, useMachine } from '@zag-js/qwik'
import { useId } from '@qwik.dev/core'
import '../../serializers.ts'
import { useEnvironmentContext } from '../../providers/environment/index.ts'
import { useLocaleContext } from '../../providers/locale/index.ts'
import type { Optional } from '../../types.ts'

export interface UseDateInputProps extends Optional<Omit<dateInput.Props, 'dir' | 'getRootNode'>, 'id'> {}
export interface UseDateInputReturn extends dateInput.Api<PropTypes> {}

/**
 * `props` is a getter so the Qwik adapter can re-read live (controlled) values
 * at the event boundary. Must be called inside a `component$`.
 *
 * The side-effect import of `../../serializers.ts` above registers the
 * `DateValue` value-serializer once per module graph -- it makes this
 * machine's `value`/`placeholderValue` context (both hold
 * `@internationalized/date` class instances) SSR-resumable. See
 * `src/serializers.ts` for the full rationale.
 */
export const useDateInput = (props: () => UseDateInputProps): UseDateInputReturn => {
  const id = useId()
  const env = useEnvironmentContext()
  const locale = useLocaleContext()

  const service = useMachine(
    dateInput.machine,
    () =>
      ({
        id,
        dir: locale.dir,
        locale: locale.locale,
        getRootNode: env.getRootNode,
        ...props(),
      }) as dateInput.Props,
  )

  return dateInput.connect(service, normalizeProps)
}
