export default {
    seoQuery: `
        seo {
            author
            opengraphAuthor
            opengraphDescription
            opengraphModifiedTime
            opengraphPublishedTime
            opengraphPublisher
            opengraphSiteName
            opengraphTitle
            opengraphType
            opengraphUrl
            opengraphImage {
                sourceUrl
                mimeType
                mediaDetails {
                    width
                    height
                }
            }
            title
            readingTime
            twitterDescription
            twitterTitle
            twitterImage {
                sourceUrl
                mimeType
                mediaDetails {
                    width
                    height
                }
            }
            metaRobotsNoindex
            metaRobotsNofollow
            metaKeywords
            metaDesc
            focuskw
            cornerstone
            canonical
            schema {
                raw
            }
        }
    `,
    seoRootQuery: `
        rootSeo: seo {
            meta {
                notFound {
                    title
                }
            }
            schema {
                inLanguage
                siteName
                siteUrl
            }
        }
    `,
}
