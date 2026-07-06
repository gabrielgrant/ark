import type { Locale } from '@zag-js/i18n-utils'
import { createContext } from '../../utils/create-context.ts'

export type UseLocaleContext = Locale

export const [LocaleContextProvider, useLocaleContext] = createContext<UseLocaleContext>({
  name: 'ark.locale',
  hookName: 'useLocaleContext',
  providerName: '<LocaleProvider />',
  strict: false,
  defaultValue: { dir: 'ltr', locale: 'en-US' },
})
