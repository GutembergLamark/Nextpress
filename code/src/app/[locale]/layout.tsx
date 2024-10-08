import { Metadata } from 'next'
import { inter } from '@/assets/fonts'
import { getRootQuery } from '@/utils/nextpress'
import { AnimatePresence } from '@/utils/motion'
import { getStaticParams } from '@/locales/server'
import { draftMode } from 'next/headers'
import { PreviewLayout } from '@/utils/nextpress/components/PreviewLayout/PreviewLayout'
import NextTopLoader from 'nextjs-toploader'

import '@/assets/sass/utilities/wordpressCompatibility.scss'
import '@/assets/sass/main.scss'

// Crie seu favicon aqui: https://realfavicongenerator.net/
// Depois cole os arquivos baixados dentro da pasta /public
export async function generateMetadata(): Promise<Metadata> {
    const { rootSeo } = await getRootQuery()
    let isProd = !(
        (process.env.NEXTHOST ?? 'homolog').includes('homolog') ||
        (process.env.NEXTHOST ?? 'localhost').includes('localhost')
    )
    return {
        metadataBase: new URL(process.env.NEXTHOST ?? ''),
        title: rootSeo?.schema?.siteName ?? '',
        robots: {
            'index': isProd,
            'follow': isProd,
            'max-image-preview': 'large',
            'max-snippet': 1,
            'max-video-preview': 1,
        },
        alternates: {
            languages: {
                [rootSeo?.schema?.inLanguage]: rootSeo?.schema?.siteUrl,
            },
        },
        icons: [
            { rel: 'icon', sizes: '16x16', url: '/favicon-16x16.png' },
            { rel: 'icon', sizes: '32x32', url: '/favicon-32x32.png' },
            {
                rel: 'apple-touch-icon',
                sizes: '100x100',
                url: '/apple-touch-icon.png',
            },
            { rel: 'manifest', url: '/site.webmanifest' },
            { rel: 'mask-icon', url: '/safari-pinned-tab.svg' },
        ],
        manifest: '/site.webmanifest',
    }
}

export function generateStaticParams() {
    return getStaticParams()
}

export default function RootLayout({
    children,
    params,
}: {
    children: React.ReactNode
    params: { locale: string }
}) {
    const { isEnabled } = draftMode()
    return (
        <html lang={params?.locale}>
            <body className={`${inter.variable}`}>
                <NextTopLoader
                    color="#00cf00"
                    zIndex={20000}
                    showSpinner={false}
                />
                {isEnabled ? <PreviewLayout /> : null}
                <AnimatePresence initial={false}>{children}</AnimatePresence>
            </body>
        </html>
    )
}
