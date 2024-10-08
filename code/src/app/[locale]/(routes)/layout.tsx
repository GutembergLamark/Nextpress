import { Header, Footer } from '@/sections/layouts'
export default function MainLayout({
    children,
    params,
}: {
    children: React.ReactNode
    params: {
        locale: string
    }
}) {
    return (
        <>
            <Header locale={params?.locale} />
            {children}
            <Footer locale={params?.locale} />
        </>
    )
}
