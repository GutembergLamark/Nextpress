'use client'
import { FormHTMLAttributes, useRef, useState } from 'react'

export function formValidate(
    formId: string,
    formData: FormData,
    host: string
): Promise<any> {
    return new Promise((resolve, reject) => {
        fetch(
            `${host}/index.php?rest_route=/contact-form-7/v1/contact-forms/${formId}/feedback`,
            { method: 'POST', body: formData }
        )
            .then(res => res.json())
            .then(response => resolve(response))
            .catch(error => {
                reject(error)
            })
    })
}

export function FormClient({
    children,
    formId,
    host,
    ...props
}: {
    children?: React.ReactElement
    formId: string
    host: string
} & FormHTMLAttributes<HTMLFormElement>) {
    const ref = useRef<HTMLFormElement>()
    const [status, setStatus] = useState<string>()
    const [message, setMessage] = useState<string>()
    const [formsValidation, setFormsValidation] =
        useState<Array<{ field: string; message: string }>>()

    return (
        <form
            data-status={status}
            data-validation={JSON.stringify(formsValidation)}
            data-form-id={formId}
            ref={ref as any}
            {...props}
            onSubmit={async e => {
                e.preventDefault()
                if (!ref?.current) return
                const formData = new FormData(ref?.current)
                try {
                    const result = await formValidate(formId, formData, host)
                    setStatus(result?.status)
                    setMessage(result?.message)
                    setFormsValidation(result?.invalid_fields)
                } catch (e) {
                    setStatus('validation_failed')
                    setMessage('Houve um problema inesperado.')
                    setFormsValidation([])
                }
            }}
        >
            {children}
            {message ? <p>{message}</p> : null}
        </form>
    )
}
