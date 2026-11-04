import { Link } from 'react-router-dom'
import { useDocumentTitle } from '../hooks/useDocumentTitle'

export default function NotFound() {
  useDocumentTitle('페이지를 찾을 수 없음')
  return (
    <div className="py-16 text-center">
      <p className="text-sm text-stone-500">404</p>
      <h1 className="mt-2 font-serif text-2xl font-bold text-stone-900 dark:text-stone-50">페이지를 찾을 수 없습니다</h1>
      <p className="mt-3 text-stone-600 dark:text-stone-400">주소가 바뀌었거나 삭제된 자료일 수 있습니다.</p>
      <Link to="/" className="mt-6 inline-block rounded bg-accent-700 px-5 py-2.5 font-medium text-white hover:bg-accent-800">
        홈으로
      </Link>
    </div>
  )
}
