import 'client-only'

export function startTreatment(formId: string) {
    document
        ?.querySelectorAll<HTMLTextAreaElement>(`#${formId} textarea`)
        ?.forEach(textArea => {
            const textAreaId = textArea.getAttribute('id')
            const label = document.querySelector(`label[for="${textAreaId}"]`)
            if (label) {
                textArea.addEventListener('input', () => {
                    if (textArea?.value != '' && textArea?.value) {
                        label.toggleAttribute('data-has-value', true)
                    } else {
                        label.toggleAttribute('data-has-value', false)
                    }
                })
                textArea.addEventListener('focus', () =>
                    label.toggleAttribute('data-focused', true)
                )
                textArea.addEventListener('blur', () =>
                    label.toggleAttribute('data-focused', false)
                )
            }
        })
    document
        ?.querySelectorAll<HTMLInputElement>(`#${formId} input`)
        ?.forEach(input => {
            const inputId = input.getAttribute('id')
            const label = document.querySelector(`label[for="${inputId}"]`)
            console.log(label)
            if (label) {
                input.addEventListener('input', () => {
                    if (input?.value != '' && input?.value) {
                        label.toggleAttribute('data-has-value', true)
                    } else {
                        label.toggleAttribute('data-has-value', false)
                    }
                })
                input.addEventListener('focus', () =>
                    label.toggleAttribute('data-focused', true)
                )
                input.addEventListener('blur', () =>
                    label.toggleAttribute('data-focused', false)
                )
            }
        })
    document
        ?.querySelectorAll<HTMLSelectElement>(`#${formId} select`)
        ?.forEach(select => {
            const selectId = select.getAttribute('id')
            const label = document.querySelector(`label[for="${selectId}"]`)
            if (label) {
                label.toggleAttribute('data-has-value', false)
                select.toggleAttribute('data-invisible', true)
                select.addEventListener('input', () => {
                    if (select?.value) {
                        label.toggleAttribute('data-has-value', true)
                        select.toggleAttribute('data-invisible', false)
                    } else {
                        label.toggleAttribute('data-has-value', false)
                        select.toggleAttribute('data-invisible', true)
                    }
                })
            }
        })
}
