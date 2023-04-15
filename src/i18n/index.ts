import { nextTick } from 'vue'
import { createI18n } from 'vue-i18n'
import getUserLocale from 'get-user-locale'
import en from './locales/en.json'

const getUserLocaleLang = () => getUserLocale()?.split('-')[0]

const SUPPORT_LOCALES = ['en', 'ru', 'kk'] as const
const KEY = 'language'

type ValueOf<T> = T extends readonly any[] ? T[number] : never
type LocaleValue = ValueOf<typeof SUPPORT_LOCALES>

const defaultLocale = 'en'
const locale =  getUserLocaleLang() || defaultLocale

const slavicPLural = (choice: number, choicesLength: number) => {
    if (choice === 0) {
        // If the number is 0, it's usually considered singular.
        return 0
    }

    const isTeen = choice > 10 && choice < 20
    const endsWithOne = choice % 10 === 1

    if (!isTeen && endsWithOne) {
        // If the number ends in 1 (but is not a teen number), it's usually singular.
        return 1
    }

    const endsWithTwoToFour = choice % 10 >= 2 && choice % 10 <= 4
    if (!isTeen && endsWithTwoToFour) {
        // If the number ends in 2-4 (but is not a teen number), it's usually dual.
        return 2
    }

    if (choicesLength < 4) {
        // If there are fewer than 4 choices, use the dual form.
        return 2
    } else {
        // Otherwise, use the plural form.
        return 3
    }
}   

const i18n = createI18n({
    legacy: false,
    fallbackLocale: defaultLocale,
    locale,
    pluralRules: {
        ru: slavicPLural
    }
})

i18n.global.setLocaleMessage(defaultLocale, en)

const asyncSetLocale = async (lang: LocaleValue) => {
    if (!SUPPORT_LOCALES.includes(lang)) return

    if (!i18n.global.availableLocales.includes(lang)) {
        const messages = await import(`./locales/${lang}.json`)
        i18n.global.setLocaleMessage(lang, messages.default)
    }
    
    i18n.global.locale.value = lang
    
    document.documentElement.lang = lang
    
    localStorage.setItem(KEY, lang)

    return await nextTick()
}

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
