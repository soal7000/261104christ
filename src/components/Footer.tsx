import { site } from '../content/site'

export default function Footer() {
  return (
    <footer className="border-t border-stone-200 py-8 text-sm text-stone-500 dark:border-stone-800 dark:text-stone-400">
      <div className="mx-auto max-w-5xl space-y-1 px-4 sm:px-6">
        <p>토론에 댓글을 작성하면 구글 계정 이름이 댓글에 공개됩니다.</p>
        <p>
          © {new Date().getFullYear()} {site.name} · {site.professor.name} {site.professor.title}
        </p>
      </div>
    </footer>
  )
}
