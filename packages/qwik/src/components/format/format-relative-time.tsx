import { formatRelativeTime } from '@zag-js/i18n-utils'
import { component$ } from '@qwik.dev/core'
import { useLocaleContext } from '../../providers/locale/index.ts'

export interface FormatRelativeTimeProps extends Intl.RelativeTimeFormatOptions {
  /**
   * The date to format.
   */
  value: Date
}

export const FormatRelativeTime = component$<FormatRelativeTimeProps>((props) => {
  const locale = useLocaleContext()
  const { value, ...intlOptions } = props

  return <>{formatRelativeTime(value, locale.locale, intlOptions)}</>
})
