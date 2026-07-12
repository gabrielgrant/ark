import { formatBytes } from '@zag-js/i18n-utils'
import { component$ } from '@qwik.dev/core'
import { useLocaleContext } from '../../providers/locale/index.ts'

export interface FormatByteProps {
  /**
   * The unit granularity to display.
   */
  unit?: 'bit' | 'byte'
  /**
   * The unit display.
   */
  unitDisplay?: 'long' | 'short' | 'narrow'
  /**
   * The unit system to use for formatting.
   */
  unitSystem?: 'decimal' | 'binary'
  /**
   * The byte size to format.
   */
  value: number
}

export const FormatByte = component$<FormatByteProps>((props) => {
  const locale = useLocaleContext()
  const { value, ...intlOptions } = props

  return <>{formatBytes(value, locale.locale, intlOptions)}</>
})
