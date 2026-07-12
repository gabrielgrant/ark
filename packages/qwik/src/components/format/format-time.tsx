import { type FormatTimeOptions, formatTime } from '@zag-js/i18n-utils'
import { component$ } from '@qwik.dev/core'
import { useLocaleContext } from '../../providers/locale/index.ts'

export interface FormatTimeProps extends FormatTimeOptions {
  /**
   * The time to format.
   */
  value: string | Date
}

export const FormatTime = component$<FormatTimeProps>((props) => {
  const locale = useLocaleContext()
  const { value, ...intlOptions } = props

  return <>{formatTime(value, locale.locale, intlOptions)}</>
})
