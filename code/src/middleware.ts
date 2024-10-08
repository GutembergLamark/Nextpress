import { createI18nMiddleware } from 'next-international/middleware'
import { NextRequest } from 'next/server'
import { fallbackLng, locales } from './locales/configs'

const I18nMiddleware = createI18nMiddleware({
    locales: locales,
    defaultLocale: fallbackLng,
    urlMappingStrategy: 'rewriteDefault',
})

export function middleware(request: NextRequest) {
    return I18nMiddleware(request)
}

export const config = {
    // Do not run the middleware on the following paths
    matcher:
        '/((?!api|_next/static|_next/image|manifest.json|assets|favicon.ico|favicon-16x16.png|favicon-32x32.png|robots.txt|android-chrome-192x192.png|android-chrome-256x256.png|apple-touch-icon.png|browserconfig.xml|mask-reverse.png|mask-reverse.svg|mask.png|mask.svg|mstile-150x150.png|site.webmanifest).*)',
}
