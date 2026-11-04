import { useEffect, useState } from 'react'
import { NavLink, useLocation } from 'react-router-dom'
import AuthButton from './AuthButton'
import Logo from './Logo'
import ThemeToggle from './ThemeToggle'

export const NAV = [
  { to: '/research', label: '연구' },
  { to: '/courses', label: '수업' },
  { to: '/about', label: '소개' },
]

/** 상단 헤더: 로고, 메뉴, 다크모드, 로그인. 모바일에서는 햄버거 메뉴로 접힙니다. */
export default function Header() {
  const [open, setOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const { pathname } = useLocation()
  useEffect(() => setOpen(false), [pathname]) // 페이지 이동 시 모바일 메뉴 닫기
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <header
      className={`sticky top-0 z-40 border-b bg-paper/90 backdrop-blur-md transition-colors ${
        scrolled || open ? 'border-line' : 'border-transparent'
      }`}
    >
      <div className="container-page flex h-16 items-center justify-between gap-4">
        <Logo />

        {/* PC 메뉴 */}
        <div className="hidden items-center gap-6 md:flex">
          <nav aria-label="주 메뉴">
            <ul className="flex items-center gap-1">
              {NAV.map((n) => (
                <li key={n.to}>
                  <NavLink
                    to={n.to}
                    className={({ isActive }) =>
                      `relative block px-3 py-2 text-[0.95rem] transition-colors after:absolute after:inset-x-3 after:-bottom-[13px] after:h-0.5 after:rounded-full ${
                        isActive ? 'font-semibold text-ink after:bg-accent' : 'text-ink-3 hover:text-ink'
                      }`
                    }
                  >
                    {n.label}
                  </NavLink>
                </li>
              ))}
            </ul>
          </nav>
          <div className="flex items-center gap-2">
            <ThemeToggle />
            <AuthButton />
          </div>
        </div>

        {/* 모바일 */}
        <div className="flex items-center gap-1 md:hidden">
          <ThemeToggle />
          <button
            type="button"
            className="rounded-lg p-2 text-ink"
            aria-expanded={open}
            aria-controls="mobile-menu"
            aria-label={open ? '메뉴 닫기' : '메뉴 열기'}
            onClick={() => setOpen((v) => !v)}
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" aria-hidden="true">
              {open ? <path d="M6 6l12 12M18 6L6 18" /> : <path d="M4 8h16M4 16h16" />}
            </svg>
          </button>
        </div>
      </div>

      {open && (
        <nav id="mobile-menu" aria-label="모바일 메뉴" className="container-page pb-5 md:hidden">
          <ul className="divide-y divide-line border-y border-line">
            {NAV.map((n) => (
              <li key={n.to}>
                <NavLink
                  to={n.to}
                  className={({ isActive }) =>
                    `flex items-center justify-between py-3.5 font-serif text-lg ${isActive ? 'font-bold text-accent-text' : 'text-ink'}`
                  }
                >
                  {n.label}
                  <span aria-hidden="true" className="text-ink-3">→</span>
                </NavLink>
              </li>
            ))}
          </ul>
          <div className="pt-4">
            <AuthButton />
          </div>
        </nav>
      )}
    </header>
  )
}
