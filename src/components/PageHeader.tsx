import type { ReactNode } from 'react'

/** 목록 페이지 상단 제목 영역 */
export default function PageHeader({ eyebrow, title, children }: { eyebrow?: string; title: string; children?: ReactNode }) {
  return (
    <header className="border-b border-line pt-12 pb-10 sm:pt-16">
      <div className="container-page">
        {eyebrow && <p className="eyebrow mb-3">{eyebrow}</p>}
        <h1 className="font-serif text-4xl leading-tight font-bold tracking-tight text-ink sm:text-5xl">{title}</h1>
        {children && <div className="mt-4 max-w-2xl text-lg text-ink-3">{children}</div>}
      </div>
    </header>
  )
}
