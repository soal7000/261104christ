import { useEffect } from 'react'
import { site } from '../content/site'

/** 페이지별 브라우저 탭 제목 설정 */
export function useDocumentTitle(title?: string) {
  useEffect(() => {
    document.title = title ? `${title} | ${site.name}` : site.name
  }, [title])
}
