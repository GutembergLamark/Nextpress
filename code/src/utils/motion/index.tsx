'use client'
import {
    motion,
    LayoutGroup as LayoutGroupMotion,
    AnimatePresence as MotionPresence,
} from 'framer-motion'
import Link from 'next/link'
import { ComponentProps, forwardRef, Ref } from 'react'
export const MotionDiv = motion.div
export const AnimatePresence = MotionPresence
export const MotionHr = motion.hr
export const MotionMain = motion.main
export const MotionButton = motion.button
export const MotionSpan = motion.span
export const MotionSection = motion.section
export const MotionP = motion.p
export const MotionArticle = motion.article
export const MotionSVG = motion.svg
export const MotionPicture = motion.picture
export const MotionLi = motion.li
export const MotionUl = motion.ul
export const MotionH1 = motion.h1
export const MotionH2 = motion.h2
export const MotionH3 = motion.h3
export const MotionH4 = motion.h4
export const MotionH5 = motion.h5
export const MotionH6 = motion.h6
export const MotionFigure = motion.figure
export const MotionForm = motion.form
export const MotionDialog = motion.dialog
export const Motion = motion
export const MotionNav = motion.nav
export const MotionHeader = motion.header
export const LayoutGroup = LayoutGroupMotion
export const MotionLink = motion(
    forwardRef(
        (props: ComponentProps<typeof Link>, ref: Ref<HTMLAnchorElement>) => (
            <Link {...props} ref={ref}>
                {props.children}
            </Link>
        )
    )
)
