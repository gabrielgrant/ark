import * as signaturePad from '@zag-js/signature-pad'
import { type PropTypes, normalizeProps, useMachine } from '@zag-js/qwik'
import { useId } from '@qwik.dev/core'
import { useEnvironmentContext } from '../../providers/environment/index.ts'
import { useLocaleContext } from '../../providers/locale/index.ts'
import type { Optional } from '../../types.ts'
import { useFieldContext } from '../field/use-field-context.ts'

export interface UseSignaturePadProps extends Optional<Omit<signaturePad.Props, 'dir' | 'getRootNode'>, 'id'> {}
export interface UseSignaturePadReturn extends signaturePad.Api<PropTypes> {}

/**
 * `props` is a getter so the Qwik adapter can re-read live (controlled) values
 * at the event boundary. Must be called inside a `component$`.
 */
export const useSignaturePad = (props: () => UseSignaturePadProps): UseSignaturePadReturn => {
  const id = useId()
  const env = useEnvironmentContext()
  const locale = useLocaleContext()
  const field = useFieldContext()

  const service = useMachine(
    signaturePad.machine,
    () =>
      ({
        id,
        ids: {
          label: field?.ids.label,
          hiddenInput: field?.ids.control,
        },
        disabled: field?.disabled,
        readOnly: field?.readOnly,
        required: field?.required,
        dir: locale.dir,
        getRootNode: env.getRootNode,
        ...props(),
      }) as signaturePad.Props,
  )

  return signaturePad.connect<PropTypes>(service, normalizeProps)
}
