import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'

/**
 * 마크다운 렌더러.
 * react-markdown 은 HTML을 직접 삽입하지 않아(XSS 안전) 교수가 작성한 본문을 안전하게 표시합니다.
 * remark-gfm 은 표·체크리스트 등 GitHub 스타일 문법을 지원합니다.
 */
export default function Markdown({ children }: { children: string }) {
  return (
    <div className="prose-body">
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        components={{
          // 외부 링크는 새 탭으로 열기
          a: ({ href, children }) => {
            const external = !!href && /^https?:\/\//.test(href)
            return (
              <a href={href} {...(external ? { target: '_blank', rel: 'noopener noreferrer' } : {})}>
                {children}
              </a>
            )
          },
        }}
      >
        {children}
      </ReactMarkdown>
    </div>
  )
}
