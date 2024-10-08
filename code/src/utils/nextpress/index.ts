import 'server-only'

export * as seoConfig from './configs/seo.nextpress.config'
export { filterUri, mergeUri } from './utilities/url-parser-wordpress'
export { readTimeCounter } from './utilities/read-time-counter'
export { fetchQuery } from './utilities/graphql-fetch'
export {
    wordpressToMetadata,
    getRootQuery,
    generateNextpressMetadata,
} from './utilities/seo-wordpress'
