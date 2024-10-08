import { FormClient } from './ContactForm.form'

export async function getFormComponents(formId: string = '') {
    let components = await fetch(
        `${process.env.HOST}/index.php?rest_route=/nextpress/v1/contact-form`,
        {
            method: 'POST',
            cache: 'force-cache',
            body: JSON.stringify({ id: formId }),
            next: {
                tags: ['wpcf7_contact_form'],
            },
            headers: { 'Content-Type': 'application/json' },
        }
    ).then(res => res.json())

    return components
}

/**
 * Componente para facilitar integração com Contact Form 7, basta passar como parâmetro o ID do formulário (encontrado na criação dele no Wordpress), e os seus componentes de formulário.
 * @param formId O ID do formulário
 * @param templates Um objeto com todos os componentes do formulário, é essencial que a chave deles seja o nome do shortcode utilizado no Contact Form 7.
 * @returns Um formulário Contact Form 7 com os componentes criados por você.
 */
export async function ContactForm({
    formId,
    templates,
}: /* @ts-expect-error Async Server Component */
IContactForm): React.ReactElement {
    const components = await getFormComponents(formId)
    return (
        <FormClient host={process.env.HOST ?? ''} formId={formId}>
            {components?.map(
                ({
                    basetype,
                    name,
                    options,
                    raw_values,
                }: {
                    basetype: string
                    name: string
                    options: string[]
                    raw_values: string[]
                }) => {
                    const FormComponent = (props: any) =>
                        templates?.[basetype]?.(props) ?? <></>
                    return (
                        <FormComponent
                            name={name}
                            key={name}
                            options={options ?? undefined}
                            raw_values={raw_values ?? undefined}
                            {...options
                                .filter((value, index) => !!raw_values[index])
                                .reduce((prev: any, option, i) => {
                                    prev[option] = raw_values[i]
                                    return prev
                                }, {})}
                        />
                    )
                }
            )}
        </FormClient>
    )
}
