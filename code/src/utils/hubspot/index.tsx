'use client'
import { usePathname } from 'next/navigation'
import { useEffect } from 'react'
import { useTrackingCode } from 'react-hubspot-tracking-code-hook'
import Script from 'next/script'

export { startTreatment } from './form/form-label-treatment'
export * as formStyle from './form/form-styling.scss'

export function HubSpotInitializer() {
    const pathName = usePathname()
    const { setPathPageView } = useTrackingCode()

    useEffect(() => {
        setPathPageView(pathName)
    }, [pathName])

    return (
        <Script
            type="text/javascript"
            id="hs-script-loader"
            strategy="lazyOnload"
            async
            defer
            src="https://js.hs-scripts.com/8900962.js"
        ></Script>
    )
}
