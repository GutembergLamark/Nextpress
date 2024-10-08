import { createI18nServer } from 'next-international/server'
import 'server-only'
import { locales } from './configs'

export const { getCurrentLocale, getStaticParams } = createI18nServer({
    'en': () => import('./en'),
    'pt-br': () => import('./pt-br'),
})
