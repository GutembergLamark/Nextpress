import { nodeByUri } from '@/utils/nextpress/utilities/graphql-fetch'
import './ExampleModule.scss'

// Use o comando yarn create-template --module <NOME_DO_MODULO> para gerar módulos com importação automática.
// Se o módulo for ter alguma informação estática pegar aqui.
async function getData(uri: string, locale: string) {
    const data = await nodeByUri(
        uri,

        `
        title
        `,
        ['Page', 'Post'],
        locale
    )
    return data
}

const ExampleModule = async ({
    fields,
    uri,
    order,
    locale,
    draft,
}: ModuleProps) => {
    const data = await getData(uri, locale)
    return <></>
}

export { ExampleModule }
