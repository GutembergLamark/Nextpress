import { revalidateTag } from 'next/cache'
import { headers } from 'next/dist/client/components/headers'
import { NextResponse } from 'next/server'
import chalk from 'chalk'

export async function POST(req: Request) {
    const data = await req.json()
    const headersList = headers()
    const authorization = headersList.get('authorization')
    if (authorization != process.env?.NEXTKEY)
        return NextResponse.json({ revalidate: false }, { status: 401 })

    if (data?.tag) revalidateTag(data.tag)
    else return NextResponse.json({ revalidate: false }, { status: 418 })

    console.log(
        chalk.green(
            `- Revalidated tag: ${chalk.cyan(`"${data?.tag}"`)} on ${new Date(
                Date.now()
            ).toString()}.`
        )
    )

    return NextResponse.json({ revalidated: true, now: Date.now() })
}
