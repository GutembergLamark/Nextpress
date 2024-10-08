import { RequestInit } from 'next/dist/server/web/spec-extension/request'
import { draftMode } from 'next/headers'
import {
    PostTypesKeys,
    postTypes,
} from '../configs/post.types.nextpress.config'

/**
 * Realiza um fetch com GraphQL na rota principal da aplicação.
 * @param query A query do GraphQL.
 * @param variables As variáveis da query.
 * @param nextFetchConfig As configurações extras do Next.
 * @returns Sua query feita, ou um erro.
 */
export async function fetchQuery(
    query: string,
    variables: { [key: string]: string | number } = {},
    nextFetchConfig: RequestInit = {},
    headers?: { [key: string]: string }
): Promise<any> {
    return fetch(
        `${process.env.HOST}/graphql?tags=` +
            nextFetchConfig?.next?.tags?.reduce(
                (prev, cur) => prev + `(${cur})`,
                ''
            ),
        {
            method: 'POST',
            cache:
                nextFetchConfig?.next?.revalidate != 0
                    ? 'force-cache'
                    : 'no-cache',
            headers: {
                'Content-Type': 'application/json',
                'Accept': `application/json`,
                ...(headers ?? null),
            },
            body: JSON.stringify({
                query: query,
                variables: {
                    ...variables,
                },
            }),
            ...nextFetchConfig,
        }
    ).then(res => {
        return res.json().then(res => {
            if (!res.data)
                throw new Error(
                    'fetchQuery error: ' + res?.errors?.[0]?.message
                )
            return res.data
        })
    })
}

/**
 * Realiza um fetch com GraphQL para os post-types especificados. Essa função tem filtro de location automático, ideal para buscar informaçÕes em qualquer post-type. A query já possui o campo "languageCode", e já é retornado.
 * @param uri A uri do post-type.
 * @param fields Uma string com os campos para serem puxados. Um abaixo do outro.
 * @param postTypes Uma array com os post-types suportados. Coloque "*" para todos post-types cadastrados.
 * @param locale O locale atual da aplicação.
 * @returns O objeto retornado.
 */
export async function nodeByUri(
    uri: string,
    fields: string,
    types: Array<PostTypesKeys> | '*',
    locale: string
) {
    const { isEnabled } = draftMode()

    let idType = 'URI'
    let numbers: Array<string> | null = uri.match(/\/(\d+)(?!.*\/)/)
    if (numbers && isEnabled) idType = 'DATABASE_ID'

    let types_
    if (types == '*') types_ = postTypes
    else types_ = types as any
    const typesQuery = types_.reduce((prev: string, cur: string) => {
        let seoQuery = `
            ${cur.toLowerCase()}(id: $uri, idType: ${idType}) {
                languageCode
                ${fields}
                translations {
                    languageCode
                    ${fields}
                    preview {
                        node {
                            ${fields}
                        }
                    }
                }
                preview {
                    node {
                        ${fields}
                    }
                }
            }
        `
        return prev + seoQuery
    }, '')

    const data = await fetchQuery(
        `
        query getNodeByUri($uri: ID = "") {
            ${typesQuery} 
        }
        `,
        { uri: idType == 'URI' ? uri : numbers ? parseInt(numbers?.[0]) : uri },
        {
            next: {
                revalidate: isEnabled ? 0 : undefined,
                tags: [uri, 'render'],
            },
            credentials: 'include',
        },
        {
            Authorization:
                'Basic ' +
                Buffer.from(`next:${process?.env?.NEXTKEY}`).toString('base64'),
        }
    )

    let node: any = {}

    Object.keys(data).forEach(key => {
        if (data[key]) node = data[key]
    })

    let nodeObject = node
    node?.translations?.forEach(
        (translation: { languageCode: string; seo: {} }) => {
            if (translation?.languageCode == locale) {
                nodeObject = translation
            }
        }
    )
    if (isEnabled && nodeObject?.preview?.node)
        nodeObject = nodeObject?.preview?.node
    if (nodeObject?.translations) delete nodeObject?.translations

    return nodeObject
}
