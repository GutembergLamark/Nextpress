import { draftMode } from 'next/headers'
import { NextRequest, NextResponse } from 'next/server'
import { redirect } from 'next/navigation'
import crypto from 'crypto'

export async function GET(request: NextRequest) {
    const searchParams = request.nextUrl.searchParams
    const redirectUrl = searchParams.get('redirect')
    const auth = searchParams.get('key')

    const hmac = crypto.createHmac('sha256', process?.env?.NEXTKEY ?? '')
    hmac.update('preview-post')
    const hashKey = hmac.digest('hex')

    const toggle = parseInt(searchParams.get('toggle') ?? '0')

    if (!toggle) {
        draftMode().disable()
        if (redirectUrl) redirect(redirectUrl)
        return new Response('Draft mode is disabled')
    }

    if (auth != hashKey || !redirectUrl)
        return NextResponse.json({ draft: false }, { status: 401 })

    if (toggle) draftMode().enable()

    redirect(redirectUrl)
}
