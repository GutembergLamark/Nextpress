'use client'

import style from './PreviewLayout.module.scss'

export function PreviewLayout() {
    return (
        <nav className={style['preview']}>
            <h2>Modo de Visualização</h2>
            <a
                onClick={() => {
                    let redirect = window.location.href
                    window.location.href = `/essentials/draft?toggle=0&redirect=${redirect}`
                }}
            >
                Sair
            </a>
        </nav>
    )
}
