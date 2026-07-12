import * as imageCropper from '@zag-js/image-cropper'
import { type PropTypes, normalizeProps, useMachine } from '@zag-js/qwik'
import { useId } from '@qwik.dev/core'
import { useEnvironmentContext } from '../../providers/environment/index.ts'
import { useLocaleContext } from '../../providers/locale/index.ts'
import type { Optional } from '../../types.ts'

export interface UseImageCropperProps extends Optional<Omit<imageCropper.Props, 'dir' | 'getRootNode'>, 'id'> {}

export interface UseImageCropperReturn extends imageCropper.Api<PropTypes> {}

/**
 * `props` is a getter so the Qwik adapter can re-read live (controlled) values
 * at the event boundary. Must be called inside a `component$`.
 */
export const useImageCropper = (props: () => UseImageCropperProps): UseImageCropperReturn => {
  const id = useId()
  const env = useEnvironmentContext()
  const locale = useLocaleContext()

  const service = useMachine(
    imageCropper.machine,
    () =>
      ({
        id,
        dir: locale.dir,
        getRootNode: env.getRootNode,
        ...props(),
      }) as imageCropper.Props,
  )

  return imageCropper.connect<PropTypes>(service, normalizeProps)
}
