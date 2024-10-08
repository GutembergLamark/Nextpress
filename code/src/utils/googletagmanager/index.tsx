'use client'

import Script from 'next/script'

export function GoogleTagManager() {
    return (
        <Script
            async
            src="https://www.googletagmanager.com/gtag/js?id=UA-175288806-1"
            type="text/javascript"
            strategy="lazyOnload"
            onLoad={() => {
                eval(`
                    window.dataLayer = window.dataLayer || []
                    function gtag() {
                        dataLayer.push(arguments)
                    }
                    gtag('js', new Date())

                    gtag('config', 'UA-175288806-1') 
                `)
            }}
        />
    )
}
