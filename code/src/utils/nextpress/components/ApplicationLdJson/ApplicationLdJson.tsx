import 'server-only'

export async function ApplicationLdJson({
    raw,
}: {
    raw?: string
    /* @ts-expect-error Async Server Component */
}): React.ReactElement {
    if (!raw || raw == '') return <></>
    return (
        <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{
                __html: raw,
            }}
        />
    )
}
