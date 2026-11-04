import { Link } from 'react-router-dom'
import { useDocumentTitle } from '../hooks/useDocumentTitle'

export default function NotFound() {
  useDocumentTitle('페이지를 찾을 수 없음')
  return (
    <div className="container-page py-24 text-center sm:py-32">
      <p className="font-serif text-7xl font-bold text-line">404</p>
      <h1 className="mt-4 font-serif text-2xl font-bold text-ink">페이지를 찾을 수 없습니다</h1>
      <p className="mt-3 text-ink-3">주소가 바뀌었거나 삭제된 자료일 수 있습니다.</p>
      <Link to="/" className="btn-primary mt-8">
        홈으로
      </Link>
    </div>
  )
}
