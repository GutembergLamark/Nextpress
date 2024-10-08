import { ReactElement } from 'react'

export interface IContactForm {
    formId: string
    templates: {
        [templateName: string]: ReactElement
    }
}
