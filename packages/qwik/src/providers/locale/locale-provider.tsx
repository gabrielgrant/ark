import { type Locale, isRTL } from '@zag-js/i18n-utils'
import { type JSXOutput, Slot, component$ } from '@qwik.dev/core'
import { LocaleContextProvider } from './use-locale-context.ts'

export interface LocaleProviderProps {
  children?: JSXOutput
  /**
   * The locale to use for the application.
   * @default 'en-US'
   */
  locale: string
}

export const LocaleProvider = component$<LocaleProviderProps>((props) => {
  const value: Locale = { locale: props.locale, dir: isRTL(props.locale) ? 'rtl' : 'ltr' }
  LocaleContextProvider(value)
  return <Slot />
})
