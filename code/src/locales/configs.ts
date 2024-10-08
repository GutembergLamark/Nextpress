// Linguagem padrão.
export const fallbackLng = 'pt-br'
// Colocar o código de todas linguagens disponíveis aqui.
export const locales = [fallbackLng, 'en'] as const
export type LocaleTypes = (typeof locales)[number]
