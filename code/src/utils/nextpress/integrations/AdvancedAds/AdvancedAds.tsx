'use client'
import { useRef, LegacyRef, useEffect, useState, useCallback } from 'react'
import style from './AdvancedAds.module.scss'

interface IShowAd {
    ad_id?: number
    group_id?: number
    route: string
    width?: number
    height?: number
}

export function ShowAd({ ad_id, group_id, route, width, height }: IShowAd) {
    const ref = useRef<HTMLIFrameElement>()
    const [loaded, setLoaded] = useState(false)
    const [srcLoaded, setSrcLoaded] = useState(false)
    const [height_, setHeight] = useState(0)

    useEffect(() => {
        setLoaded(true)
        window.addEventListener('message', function (e) {
            if (
                e?.data?.location !=
                `${route}/index.php?rest_route=/nextpress/v1/ads&${
                    !!group_id
                        ? `group=${group_id}`
                        : !!ad_id
                        ? `ad=${ad_id}`
                        : ''
                }`
            ) {
                return
            }
            if (e?.data?.height) {
                setHeight(parseInt(e?.data?.height))
                setSrcLoaded(true)
            }
        })
    }, [ref])

    return !ad_id && !group_id ? null : (
        <div
            className={style.ads}
            data-skeleton={width && height ? '' : null}
            style={{
                aspectRatio:
                    !srcLoaded && width && height
                        ? `${width}/${height}`
                        : undefined,
                height: height_ != 0 ? height_ + 'px' : undefined,
            }}
        >
            <iframe
                ref={ref as LegacyRef<HTMLIFrameElement>}
                loading="lazy"
                data-loaded={srcLoaded ? '' : null}
                style={{ height: height_ != 0 ? height_ + 'px' : undefined }}
                src={
                    loaded
                        ? `${route}/index.php?rest_route=/nextpress/v1/ads&${
                              !!group_id
                                  ? `group=${group_id}`
                                  : !!ad_id
                                  ? `ad=${ad_id}`
                                  : ''
                          }`
                        : ''
                }
            ></iframe>
        </div>
    )
}
