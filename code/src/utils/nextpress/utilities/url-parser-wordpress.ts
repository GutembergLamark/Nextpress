/**
 * Transforma uma array de strings em um texto de URI.
 * @param uriArray Uma array com strings dentro.
 * @returns Uma string formatada, ex: ['exemplo', 'path'] para '/exemplo/path'
 */
export function mergeUri(uriArray: string[], exceptions?: string[]) {
    let array_ = uriArray
    if (exceptions) {
        array_ = array_.filter(
            element => !exceptions?.find(es => es == element)
        )
    }
    return `/${array_.join('/')}`
}

/**
 * Filtra uma string em um array de strings.
 * @param uri Uma string de URI, ex: /exemplo/path
 * @returns A string formatada, ex: ['exemplo', 'path']
 */
export function filterUri(uri: string, exceptions?: string[]) {
    return uri
        .split('/')
        .filter(e => e != '' && !exceptions?.find(element => element == e))
}
