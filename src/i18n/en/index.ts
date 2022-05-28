import { BaseTranslation, i18n, i18nObject, i18nString } from "typesafe-i18n";
import { typesafeI18nObject } from "typesafe-i18n";
import { date } from "typesafe-i18n/formatters";

const en: BaseTranslation = {
    error: {
        "InitError": "",
        "InvalidReservablePackage": "",
        "WrongStepInDeliverySequence": "",
        "UserAlreadyCurrentHolder": "",
        "UserNotFound": "",
        "DeliveryStepNotAdded": "",
        "DeliveryStepNotFound": "",
        "DeliveryStepNotInitialized": "",
        "DeliveryStepNotYetAccepted": "",
        "InvalidUser": "",
        "SenderCantBeReserver": "",
        "SenderCantBeDispatcher": "",
        "ReserverNotFound": "",
        "ReserverAlreadySelected": "",
        "ReceiverCantBeReserver": "",
        "ReceiverCantBeDispatcher": "",
        "UserAlreadyADispatcher": "",
        "InvalidSender": "",
    },
    success: {
        "InvalidRecipient": "",
        "ReserverAdded": "",
        "ReserverRemoved": "",
        "CurrentHolderSet": "",
        "DeliveryStepAdded": "",
        "ReserveRequestRejected": "",
        "ReserveRequestAccepted": "",
        "DeliveryStepInitialized": "",
        "DeliveryRequestAccepted": "",
        "DeliveryRequestRejected": "",
        "PackagePickedUp": "",
        "PackageDelivered": "",
        "PackageDispatched": ""
    }
} as const;

const translations = {
    HI: "Hello {name|uppercase}"
}

const formatters = {
    uppercase: (value: string) => value.toUpperCase()
}

const LL = i18nObject<Locales, Translation, TranslationFunctions, Formatters>('en', translations, formatters)

type Locales = 'en' | 'de' | 'it'

type Translation = {
    'HI': string
}

type TranslationFunctions = {
    'HI': (arg: { name: string }) => string
}

type Formatters = {
    uppercase: (value: string) => string
}

export default LL

// // format any
// const formatters = {
//     weekday: date(locale, { weekday: "long" }),
//     uppercase: (value: string) => value.toUpperCase()
// };

// const EN = typesafeI18nObject(locale, en, formatters);

// const options = { style: 'currency', currency: 'EUR' }

// // for locale 'en'
// const euroFormatterEN = Intl.NumberFormat('en', options)

// const formattersEN = {
//    'currency': (value) => euroFormatterEN.format(value)
// }

// // for locale 'de'
// const euroFormatterDE = Intl.NumberFormat('de', options)

// const formattersDE = {
//    'currency': (value) => euroFormatterDE.format(value)
// }

// const locale = 'en'
// const formatters = {
//    uppercase: (value) => value.toUpperCase()
// }

// const LLL = i18nString(locale, formatters)

// LLL('Hello {name|uppercase}!', { name: 'world' }) // => 'Hello WORLD!'

// // const locale = 'en'
// const translations = {
//    HI: "Hello {name}!",
//    RESET_PASSWORD: "reset password"
//    /* ... */
// }
// // const formatters = { /* ... */ }

// const LL = i18nObject(locale, translations, formatters)

// LL.HI({ name: 'world' }) // => 'Hello world!'
// LL.RESET_PASSWORD() // => 'reset password'
// const localeTranslations = {
//     en: { TODAY: "Today is {date|weekday}" },
//     de: { TODAY: "Heute ist {date|weekday}" },
//     it: { TODAY: "Oggi è {date|weekday}" },
//  }

//  const loadLocale = (locale) => localeTranslations[locale]

//  const initFormatters = (locale) => {
//     const dateFormatter =
//        new Intl.DateTimeFormat(locale, { weekday: 'long' })

//     return {
//        date: (value) => dateFormatter.format(value)
//     }
//  }

//  const L = i18n(loadLocale, initFormatters)

//  const now = new Date()

//  L.en.TODAY({ date: now }) // => 'Today is friday'
//  L.de.TODAY({ date: now }) // => 'Heute ist Freitag'
//  L.it.TODAY({ date: now }) // => 'Oggi è venerdì'
//  //////////////////////////////////////////////////////////
//  const translations = {
//     HI: "Hello {name|uppercase}"
//  }

//  const formatters = {
//     uppercase: (value: string) => value.toUpperCase()
//  }

//  const LL = i18nObject<Locales, Translation, TranslationFunctions, Formatters>('en', translations, formatters)
// /////////////////////////

// type Locales = 'en' | 'de' | 'it'

// type Translation = {
//    'HI': string
// }

// type TranslationFunctions = {
//    'HI': (arg: { name: string }) => string
// }

// type Formatters = {
//    uppercase: (value: string) => string
// }
