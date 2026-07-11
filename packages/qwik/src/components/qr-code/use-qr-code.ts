import * as qrCode from '@zag-js/qr-code'
import { type PropTypes, normalizeProps, useMachine } from '@zag-js/qwik'
import { useId } from '@qwik.dev/core'
import { useEnvironmentContext } from '../../providers/environment/index.ts'
import { useLocaleContext } from '../../providers/locale/index.ts'
import type { Optional } from '../../types.ts'

export interface UseQrCodeProps extends Optional<Omit<qrCode.Props, 'dir' | 'getRootNode'>, 'id'> {}
export interface UseQrCodeReturn extends qrCode.Api<PropTypes> {}

/**
 * `props` is a getter so the Qwik adapter can re-read live (controlled) values
 * at the event boundary. Must be called inside a `component$`.
 */
export const useQrCode = (props: () => UseQrCodeProps): UseQrCodeReturn => {
  const id = useId()
  const env = useEnvironmentContext()
  const locale = useLocaleContext()

  const service = useMachine(
    qrCode.machine,
    () =>
      ({
        id,
        dir: locale.dir,
        getRootNode: env.getRootNode,
        ...props(),
      }) as qrCode.Props,
  )

  return qrCode.connect(service, normalizeProps)
}
