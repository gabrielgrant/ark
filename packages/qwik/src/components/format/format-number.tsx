import { formatNumber } from '@zag-js/i18n-utils'
import { component$ } from '@qwik.dev/core'
import { useLocaleContext } from '../../providers/locale/index.ts'

export interface FormatNumberProps extends Intl.NumberFormatOptions {
  /**
   * The number to format.
   */
  value: number
}

export const FormatNumber = component$<FormatNumberProps>((props) => {
  const locale = useLocaleContext()
  const { value, ...intlOptions } = props

  return <>{formatNumber(value, locale.locale, intlOptions)}</>
})
