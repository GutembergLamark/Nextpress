import Link from 'next/link'
import React from 'react'

export function InternalLink({
    children,
    target,
    href,
    hardLink,
    ...props
}: React.ComponentProps<typeof Link> & { hardLink?: boolean; href: string }) {
    let href_ = href
    if (href?.endsWith('/') && href?.length > 1) {
        href_ = href_.slice(0, -1)
    }

    return !hardLink ? (
        <Link {...props} href={href_} target={target} prefetch={false}>
            {children}
        </Link>
    ) : (
        <a {...props} href={href} target={target ?? '_self'}>
            {children}
        </a>
    )
}
