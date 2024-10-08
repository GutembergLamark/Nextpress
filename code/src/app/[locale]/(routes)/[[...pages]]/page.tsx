import { mergeUri, generateNextpressMetadata } from '@/utils/nextpress'
import { ApplicationLdJson, DynamicModules } from '@/utils/nextpress/components'
import { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { MotionMain } from '@/utils/motion'
import { setStaticParamsLocale } from 'next-international/server'

type PagesParams = { params: { pages: string[]; locale: string } }

export async function generateStaticParams() {
    return [{ pages: [] }]
}

export async function generateMetadata({
    params,
}: PagesParams): Promise<Metadata> {
    const uri = mergeUri(params?.pages ?? [])

    return await generateNextpressMetadata(uri, params?.locale, 'Page')
}

export default async function Page({ params }: PagesParams) {
    setStaticParamsLocale(params?.locale)
    const uri = mergeUri(params?.pages ?? [])

    const node = await generateNextpressMetadata(uri, params?.locale, 'Page')
    if (node?.notFound) notFound()

    return (
        <MotionMain key={uri} initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            <DynamicModules locale={params?.locale} field="main" uri={uri} />
            <ApplicationLdJson raw={node?.schema?.raw} />
        </MotionMain>
    )
}
