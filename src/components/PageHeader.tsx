import type { ReactNode } from 'react'

/** 각 페이지 상단 제목 영역 */
export default function PageHeader({ eyebrow, title, children }: { eyebrow?: string; title: string; children?: ReactNode }) {
  return (
    <header className="mb-10">
      {eyebrow && <p className="mb-2 text-sm font-medium text-accent-600 dark:text-accent-300">{eyebrow}</p>}
      <h1 className="font-serif text-3xl leading-tight font-bold text-stone-900 sm:text-4xl dark:text-stone-50">{title}</h1>
      {children && <div className="mt-4 max-w-2xl text-stone-600 dark:text-stone-400">{children}</div>}
    </header>
  )
}
