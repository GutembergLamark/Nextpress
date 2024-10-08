import { MotionMain } from '@/utils/motion'
import '@/assets/sass/pages/notFound.scss'

export default function NotFound() {
    return (
        <MotionMain
            key="not-found"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
        >
            <h2>404</h2>
            <h3>Oops! Page not found.</h3>
        </MotionMain>
    )
}
