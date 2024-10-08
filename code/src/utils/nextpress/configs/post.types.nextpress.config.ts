export const postTypes = ['Post', 'Page'] as const
export type PostTypesKeys = (typeof postTypes)[number]
