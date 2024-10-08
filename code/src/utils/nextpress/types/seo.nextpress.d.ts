declare interface SeoMetadata {
    author: string
    opengraphAuthor: string
    opengraphDescription: string
    opengraphModifiedTime: string
    opengraphPublishedTime: string
    opengraphPublisher: string
    opengraphSiteName: string
    opengraphTitle: string
    opengraphType: string
    opengraphUrl: string
    opengraphImage: {
        sourceUrl: string
        mimeType: string
        mediaDetails: {
            width: number
            height: number
        }
    }
    title: string
    readingTime: number
    twitterDescription: string
    twitterTitle: string
    twitterImage: {
        sourceUrl: string
        mimeType: string
        mediaDetails: {
            width: number
            height: number
        }
    }
    metaRobotsNoindex: string
    metaRobotsNofollow: string
    metaKeywords: string
    metaDesc: string
    focuskw: string
    cornerstone: boolean
    canonical: string
    schema: {
        raw: string
    }
}

declare interface OptimizedMetadata {
    notFound?: boolean
    schema?: { raw: string }
}

declare interface SeoRootMetadata {
    rootSeo: {
        meta: {
            notFound: {
                title: string
            }
        }
        schema: {
            inLanguage: string
            siteName: string
            siteUrl: string
        }
    }
}
