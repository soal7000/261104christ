import { useEffect } from 'react'
import { Outlet, useLocation } from 'react-router-dom'
import Header from './Header'
import Footer from './Footer'

/** 공통 레이아웃: 본문 바로가기 링크 + 헤더 + 본문 + 푸터 */
export default function Layout() {
  const { pathname } = useLocation()
  // 페이지 이동 시 맨 위로 스크롤
  useEffect(() => window.scrollTo(0, 0), [pathname])

  return (
    <div className="flex min-h-screen flex-col">
      <a href="#main" className="btn-primary sr-only z-50 focus:not-sr-only focus:fixed focus:top-3 focus:left-3">
        본문 바로가기
      </a>
      <Header />
      {/* key: 페이지마다 진입 애니메이션을 다시 실행 */}
      <main id="main" tabIndex={-1} key={pathname} className="page-enter flex-1 outline-none">
        <Outlet />
      </main>
      <Footer />
    </div>
  )
}
