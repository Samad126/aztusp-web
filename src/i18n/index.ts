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

const WEEKDAY_KEYS = ['weekday.monday', 'weekday.tuesday', 'weekday.wednesday', 'weekday.thursday', 'weekday.friday'] as const

/** The heading for a school day: translated for Monday to Friday, and the name the API gave for any other day. */
export function weekdayLabel(index: number | undefined, name: string) {
  return index === undefined ? name : i18n.t(WEEKDAY_KEYS[index])
}

/** The label for a lesson type from the API (`lecture`, `lab`). An empty type, or one not listed here, is shown as it came. */
export function lessonTypeLabel(type: string) {
  if (type === 'lecture') return i18n.t('lesson.lecture')
  if (type === 'lab') return i18n.t('lesson.lab')
  return type
}

/** The label for a week from the API (`upper`, `lower`, `both`). A week not listed here is shown as it came. */
export function weekLabel(week: string) {
  if (week === 'upper') return i18n.t('week.upper')
  if (week === 'lower') return i18n.t('week.lower')
  if (week === 'both') return i18n.t('week.both')
  return week
}

export default i18n
