import i18n from 'i18next'
import LanguageDetector from 'i18next-browser-languagedetector'
import { initReactI18next } from 'react-i18next'
import { az, en, languages, type MessageKey } from './messages.ts'

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources: { en: { translation: en }, az: { translation: az } },
    supportedLngs: languages.map((language) => language.code),
    nonExplicitSupportedLngs: true,
    load: 'languageOnly',
    fallbackLng: 'en',
    // Keys are flat ("nav.home") and variables are written {name}.
    keySeparator: false,
    interpolation: { escapeValue: false, prefix: '{', suffix: '}' },
    detection: {
      order: ['localStorage', 'navigator'],
      lookupLocalStorage: 'userhelper-language',
      caches: ['localStorage'],
    },
  })

const syncDocumentLanguage = (language: string) => {
  document.documentElement.lang = language
}
syncDocumentLanguage(i18n.language)
i18n.on('languageChanged', syncDocumentLanguage)

/** The label for a field key from the API, falling back to a readable version of the key. */
export function fieldLabel(key: string) {
  const messageKey = `field.${key}`
  if (i18n.exists(messageKey)) return i18n.t(messageKey as MessageKey)
  const words = key.replace(/([a-z])([A-Z])/g, '$1 $2').replace(/[_-]+/g, ' ').trim().toLowerCase()
  return words.charAt(0).toUpperCase() + words.slice(1)
}

export default i18n
