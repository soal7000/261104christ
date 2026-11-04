import type { ReactNode } from 'react'
import { Link } from 'react-router-dom'
import Icon from './Icon'

/**
 * 연구·수업 상세 페이지 공통 레이아웃.
 * PC: 본문(읽기 폭 제한) + 오른쪽 정보 패널(스크롤 따라옴) / 모바일: 위아래로 쌓임
 */
export default function DetailLayout(props: {
  backTo: string
  backLabel: string
  eyebrow: string
  title: string
  lead: ReactNode
  aside: ReactNode
  children: ReactNode
}) {
  return (
    <article>
      <header className="border-b border-line">
        <div className="container-page pt-8 pb-10 sm:pt-10 sm:pb-12">
          <Link to={props.backTo} className="inline-flex items-center gap-1.5 text-sm text-ink-3 hover:text-ink">
            <Icon name="back" className="h-4 w-4" /> {props.backLabel}
          </Link>
          <p className="eyebrow mt-8 mb-3">{props.eyebrow}</p>
          <h1 className="max-w-4xl font-serif text-3xl leading-[1.25] font-bold tracking-tight text-ink sm:text-[2.75rem]">{props.title}</h1>
          <div className="mt-5 max-w-3xl text-lg leading-relaxed text-ink-2 sm:text-xl">{props.lead}</div>
        </div>
      </header>
      <div className="container-page grid gap-12 py-12 lg:grid-cols-[minmax(0,1fr)_17rem] lg:gap-16">
        <div className="min-w-0 max-w-[44rem]">{props.children}</div>
        <aside className="order-first lg:order-none">
          <div className="space-y-8 lg:sticky lg:top-24">{props.aside}</div>
        </aside>
      </div>
    </article>
  )
}

/** 정보 패널의 한 블록 */
export function AsideBlock({ title, children }: { title: string; children: ReactNode }) {
  return (
    <div>
      <h2 className="eyebrow mb-3 text-ink-3">{title}</h2>
      {children}
    </div>
  )
}

/** '토론으로 이동' 버튼 */
export function JumpToDiscussion() {
  return (
    <a href="#discussion" className="btn-ghost w-full text-sm">
      <Icon name="chat" className="h-4 w-4" /> 토론으로 이동
    </a>
  )
}
