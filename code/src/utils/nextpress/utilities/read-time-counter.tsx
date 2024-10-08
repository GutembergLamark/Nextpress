/**
 * Recebe o conteúdo de um Post ou algo similar, e conta o tempo estimado de leitura.
 * @param content O conteúdo.
 * @returns Quantidade de minutos estimados para a conclusão da leitura.
 */
export function readTimeCounter(content: string) {
    const words = content?.split(' ')
    const minutes = Math.ceil(words?.length / 200)
    return minutes
}
