'use client'
import { createI18nClient } from 'next-international/client'

export const { useChangeLocale, useCurrentLocale } = createI18nClient({
    'en': () => import('./en'),
    'pt-br': () => import('./pt-br'),
})
