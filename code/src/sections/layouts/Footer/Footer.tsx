import { fetchQuery } from '@/utils/nextpress'
import './Footer.scss'

// async function getData() {
//     const res = await Promise.all([
//         fetchQuery(
//             `
//             query getMenu($id: ID! = "") {
//                 menu(id: $id, idType: NAME) {
//                     menuItems {
//                         nodes {
//                             uri
//                             target
//                             label
//                         }
//                     }
//                 }
//             }`,
//             { id: 'main' },
//             { next: { tags: ['main'] } }
//         ),
//     ])
//     return res
// }

const Footer = async ({ locale }: { locale: string }) => {
    // const [menuData] = await getData()
    return <footer className="footer">FOOTER</footer>
}

export { Footer }
