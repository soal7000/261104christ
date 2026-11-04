import { useEffect, useState } from 'react'
import { Link, NavLink, useLocation } from 'react-router-dom'
import { site } from '../content/site'
import AuthButton from './AuthButton'
import ThemeToggle from './ThemeToggle'

const NAV = [
  { to: '/research', label: '연구' },
  { to: '/courses', label: '수업' },
  { to: '/about', label: '소개' },
]

const navClass = ({ isActive }: { isActive: boolean }) =>
  `rounded px-3 py-2 text-[0.95rem] transition-colors ${
    isActive
      ? 'font-semibold text-accent-700 dark:text-accent-300'
      : 'text-stone-600 hover:text-stone-900 dark:text-stone-400 dark:hover:text-stone-100'
  }`

/** 상단 헤더: 사이트명, 메뉴, 다크모드, 로그인 버튼. 모바일에서는 햄버거 메뉴로 접힙니다. */
export default function Header() {
  const [open, setOpen] = useState(false)
  const { pathname } = useLocation()
  useEffect(() => setOpen(false), [pathname]) // 페이지 이동 시 모바일 메뉴 닫기

  return (
    <header className="sticky top-0 z-40 border-b border-stone-200 bg-stone-50/95 backdrop-blur dark:border-stone-800 dark:bg-stone-950/95">
      <div className="mx-auto flex h-16 max-w-5xl items-center justify-between gap-4 px-4 sm:px-6">
        <Link to="/" className="font-serif text-lg font-bold tracking-tight text-accent-700 dark:text-accent-300">
          {site.name}
        </Link>

        {/* PC 메뉴 */}
        <nav aria-label="주 메뉴" className="hidden items-center gap-1 md:flex">
          {NAV.map((n) => (
            <NavLink key={n.to} to={n.to} className={navClass}>
              {n.label}
            </NavLink>
          ))}
          <span className="mx-2 h-5 w-px bg-stone-300 dark:bg-stone-700" aria-hidden="true" />
          <ThemeToggle />
          <AuthButton />
        </nav>

        {/* 모바일 메뉴 버튼 */}
        <div className="flex items-center gap-1 md:hidden">
          <ThemeToggle />
          <button
            type="button"
            className="rounded p-2 text-stone-700 dark:text-stone-300"
            aria-expanded={open}
            aria-controls="mobile-menu"
            aria-label={open ? '메뉴 닫기' : '메뉴 열기'}
            onClick={() => setOpen((v) => !v)}
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
              {open ? <path d="M6 6l12 12M18 6L6 18" /> : <path d="M4 7h16M4 12h16M4 17h16" />}
            </svg>
          </button>
        </div>
      </div>

      {open && (
        <nav id="mobile-menu" aria-label="모바일 메뉴" className="border-t border-stone-200 px-4 pb-4 md:hidden dark:border-stone-800">
          <ul className="flex flex-col py-2">
            {NAV.map((n) => (
              <li key={n.to}>
                <NavLink to={n.to} className={(s) => `block ${navClass(s)}`}>
                  {n.label}
                </NavLink>
              </li>
            ))}
          </ul>
          <div className="px-3 pt-2">
            <AuthButton />
          </div>
        </nav>
      )}
    </header>
  )
}
