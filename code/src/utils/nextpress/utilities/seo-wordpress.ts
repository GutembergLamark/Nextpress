import { Metadata } from 'next'
import { fetchQuery, seoConfig } from '..'
import { PostTypesKeys } from '../configs/post.types.nextpress.config'
import { draftMode } from 'next/headers'

/**
 * Essa função gera um objeto metadata utilizando todas as funcões de SEO do Nextpress. É perfeita para automação, basta ser puxada no retorno do generateMetadata() do Next.
 * @param uri A string URI, use a função mergeUri(string[]) para transformar os paramêtros do Next em uma string URI.
 */
export async function generateNextpressMetadata(
    uri: string,
    locale: string,
    type: PostTypesKeys,
    queryType: 'nodeByUri' | 'nodeBy' = 'nodeByUri',
    notFoundTitle?: string
): Promise<Metadata & OptimizedMetadata> {
    const { isEnabled } = draftMode()

    if (isEnabled)
        return {
            title: 'Modo de visualização',
        }

    const [{ node }, { rootSeo }] = await Promise.all([
        fetchQuery(
            queryType == 'nodeByUri'
                ? `
            query getPagesSEO($uri: String = "") {
                node: nodeByUri(uri: $uri) {
                    ... on ${type} {
                        status
                        ${seoConfig.default.seoQuery}
                        translations {
                            languageCode
                            ${seoConfig.default.seoQuery}
                        }
                    }
                }
            }
            `
                : `
            query getPagesSEO($uri: String = "") {
                node: ${type?.toLocaleLowerCase()}By(uri: $uri) {
                    status
                    ${seoConfig.default.seoQuery}
                    translations {
                        languageCode
                        ${seoConfig.default.seoQuery}
                    }
                }
            }
            `,
            { uri },
            { next: { tags: [uri, 'verification'] } }
        ),
        getRootQuery(),
    ])

    const seo: SeoMetadata = node?.seo

    if (!seo || node?.status != 'publish') {
        return {
            notFound: true,
            title:
                rootSeo?.meta?.notFound?.title ??
                notFoundTitle ??
                'Página não encontrada',
        }
    }

    let languageObject
    node?.translations?.forEach(
        (translation: { languageCode: string; seo: {} }) => {
            if (translation?.languageCode == locale) {
                languageObject = translation?.seo
            }
        }
    )
    if (!languageObject) {
        languageObject = seo
    }

    return wordpressToMetadata(languageObject)
}

/**
 * Converte um objeto SeoMetadata (informações vindas do Yoast do WpGraphQL, que não sejam globais) em Metadata (informações aceitas pelo Next).
 * @param seo O objeto retornado por alguma query de SEO do WpGraphQL.
 * @returns Um objeto formatado aceito pelo Next como Metadata.
 */
export function wordpressToMetadata(
    seo: SeoMetadata
): Metadata & OptimizedMetadata {
    return {
        title: seo?.title,
        keywords: seo?.focuskw.split(' '),
        description: seo?.metaDesc,
        publisher: seo?.opengraphPublisher,
        authors: [{ name: seo?.author }],
        schema: {
            raw: seo?.schema?.raw ?? '',
        },
        openGraph: {
            type: seo?.opengraphType as 'article',
            title: seo?.opengraphTitle,
            url: seo?.opengraphUrl,
            description: seo?.opengraphDescription,
            publishedTime: seo?.opengraphPublishedTime,
            siteName: seo?.opengraphSiteName,
            modifiedTime: seo?.opengraphModifiedTime,
            images: [
                {
                    url: seo?.opengraphImage?.sourceUrl,
                    width: seo?.opengraphImage?.mediaDetails?.width,
                    height: seo?.opengraphImage?.mediaDetails?.height,
                    type: seo?.opengraphImage?.mimeType,
                },
            ],
        },
        twitter: {
            description: seo?.twitterDescription,
            title: seo?.twitterTitle,
            card: 'summary_large_image',
            images: [
                {
                    url: seo?.twitterImage?.sourceUrl,
                    width: seo?.twitterImage?.mediaDetails?.width,
                    height: seo?.twitterImage?.mediaDetails?.height,
                },
            ],
        },
        alternates: {
            canonical: seo?.canonical,
        },
        other: {
            'article:publisher': seo?.opengraphPublisher,
            'article:published_time': seo?.opengraphPublishedTime,
            'article:modified_time': seo?.opengraphModifiedTime,
        },
    }
}

/**
 * Retorna a query global de SEO do Yoast, é otimo para pegar algumas configurações globais. A query é customizável no arquivo configs/seo.nextpress.config.ts
 * @returns Um objeto SeoRootMetadata, tipagem customizável em types/seo.nextpress.d.ts
 */
export async function getRootQuery(): Promise<SeoRootMetadata> {
    const rootQuery: SeoRootMetadata = await fetchQuery(
        `
        query getRootSeo {
            ${seoConfig.default.seoRootQuery}
        }`,
        {},
        { next: { tags: ['wpseo_titles'] } }
    )
    return rootQuery
}
