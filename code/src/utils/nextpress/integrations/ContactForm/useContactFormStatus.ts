'use client'

import { Ref, useEffect, useState } from 'react'

export function useContactFormStatus(ref: any, name?: string) {
    const [error, setError] = useState<string | undefined>()

    useEffect(() => {
        const form = ref?.current?.form
        if (!form && !name)
            setError(
                'Coloque este componente dentro de um formulário Contact Form 7.'
            )
        const observer = new MutationObserver(mutations => {
            mutations.forEach(mutation => {
                const formValidation: Array<{
                    field: string
                    message: string
                }> = JSON.parse(
                    (
                        mutation.target as unknown as HTMLFormElement
                    )?.getAttribute('data-validation') ?? '[]'
                )
                const thisElement =
                    formValidation?.filter(v => v.field == name) ?? []
                setError(thisElement?.[0]?.message)
            })
        })
        observer.observe(form, { attributes: true })
    }, [])

    return error
}
