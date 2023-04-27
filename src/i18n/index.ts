import { nextTick } from 'vue'
import { createI18n } from 'vue-i18n'
import getUserLocale from 'get-user-locale'
import en from './locales/en.json'
import { slavicPlural } from './pluralRules'
import eventBus from '@/composables/eventBus'

const getUserLocaleLang = () => getUserLocale()?.split('-')[0]

const SUPPORT_LOCALES = ['en', 'ru', 'kk'] as const
const KEY = 'language'

type ValueOf<T> = T extends readonly any[] ? T[number] : never
type LocaleValue = ValueOf<typeof SUPPORT_LOCALES>

const defaultLocale = 'en'
const locale =  getUserLocaleLang() || defaultLocale

const i18n = createI18n({
    legacy: false,
    fallbackLocale: defaultLocale,
    locale,
    pluralRules: {
        ru: slavicPlural
    }
})

i18n.global.setLocaleMessage(defaultLocale, en)

const loadLocale = async (lang: LocaleValue) => {
    const messages = await import(`./locales/${lang}.json`)
    i18n.global.setLocaleMessage(lang, messages.default)
}

const saveLocale = (lang: LocaleValue) => {
    i18n.global.locale.value = lang
    
    document.documentElement.lang = lang
    
    localStorage.setItem(KEY, lang)
}

const asyncSetLocale = async (lang: LocaleValue) => {
    if (!SUPPORT_LOCALES.includes(lang)) return

    if (!i18n.global.availableLocales.includes(lang)) {
        await loadLocale(lang)
    }
    
    saveLocale(lang)
    
    eventBus.emit('langChanged', lang)
    return await nextTick()
}

const loadDefaultLocale = async () => {
    await loadLocale(locale as LocaleValue)
}

if (locale !== defaultLocale) loadDefaultLocale()

export {
    i18n,
    KEY,
    locale,
    defaultLocale,
    SUPPORT_LOCALES,
    asyncSetLocale,
    getUserLocaleLang,
    type LocaleValue
}
