import * as Modules from '@/sections/modules'
import { draftMode } from 'next/headers'
import 'server-only'

/**
 * Esse componente busca atráves de um "field" especificado todos os módulos flexíveis existentes em um Post / Page do Wordpress. E renderiza (se encontrar) os módulos subsequentes exportados em @/sections/modules
 * @param field O nome do campo ACF onde o conteúdo flexível está localizado.
 * @param uri O URI da página do conteúdo flexível.
 * @param staticCount Quantos módulos estáticos existem antes desse na página (opcional)
 * @returns
 */
const DynamicModules = async ({
    field,
    uri,
    locale,
    staticCount = 0,
}: {
    field: string
    uri: string
    locale: string
    staticCount?: number
    /* @ts-expect-error Async Server Component */
}): React.ReactElement => {
    const { isEnabled } = draftMode()
    const [dynamic, draftDynamic]: Array<{
        modules: Array<any> | null
        _id: string | 0
        post_type: string | false
    } | null> = await Promise.all([
        fetch(`${process.env.HOST}/wp-json/nextpress/v1/modules`, {
            cache: isEnabled ? 'no-cache' : 'force-cache',
            next: {
                tags: [uri],
                revalidate: isEnabled ? 0 : undefined,
            },
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'authorization': process.env.NEXTKEY ?? '',
            },
            body: JSON.stringify({
                uri,
                field,
                locale,
                draft: isEnabled,
            }),
        }).then(res => res.json()),
        isEnabled
            ? fetch(`${process.env.HOST}/wp-json/nextpress/v1/modules`, {
                  next: {
                      revalidate: 0,
                  },
                  method: 'POST',
                  headers: {
                      'Content-Type': 'application/json',
                      'authorization': process.env.NEXTKEY ?? '',
                  },
                  body: JSON.stringify({
                      id: uri.split('/')[uri.split('/')?.length - 1],
                      field,
                      locale,
                      draft: isEnabled,
                  }),
              }).then(res => res.json())
            : null,
    ])

    const main = draftDynamic?.modules ? draftDynamic : dynamic

    return main?.modules ? (
        <>
            {main?.modules.map((module, i) => {
                const Module =
                    Modules?.[
                        (module?.['acf_fc_layout'] ??
                            '') as keyof typeof Modules
                    ] ?? false
                return Module ? (
                    <Module
                        fields={module || {}}
                        uri={uri ?? ''}
                        order={staticCount + (i + 1)}
                        key={`dynamic-module-${i}`}
                        locale={locale}
                        draft={isEnabled}
                    />
                ) : (
                    <></>
                )
            })}
        </>
    ) : (
        <></>
    )
}

export { DynamicModules }
