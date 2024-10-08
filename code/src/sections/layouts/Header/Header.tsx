import { fetchQuery } from '@/utils/nextpress'
import './Header.scss'

// async function getData() {
//     return await fetchQuery(
//         `
//         query getMenu($id: ID! = "") {
//             menu(id: $id, idType: NAME) {
//                 menuItems {
//                     nodes {
//                         uri
//                         target
//                         label
//                     }
//                 }
//             }
//         }`,
//         { id: 'main' },
//         { next: { tags: ['main'] } }
//     )
// }

const Header = async ({ locale }: { locale: string }) => {
    // const data = await getData()
    return <header className="header">HEADER</header>
}

export { Header }
