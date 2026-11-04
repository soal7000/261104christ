import { useEffect, useRef, useState, type FormEvent } from 'react'
import { useAuth } from '../hooks/useAuth'
import { authErrorMessage, signInWithGoogle } from '../services/auth'
import {
  MAX_COMMENT_LENGTH,
  addComment,
  commentErrorMessage,
  deleteComment,
  fetchComments,
  validateCommentText,
  type Comment,
  type TargetType,
} from '../services/comments'

interface Props {
  targetType: TargetType
  targetId: string
}

const dateFormat = new Intl.DateTimeFormat('ko-KR', { dateStyle: 'medium', timeStyle: 'short' })

/**
 * 연구·수업 상세 페이지 하단의 공통 토론(댓글) 영역.
 * - 비로그인: 읽기 + 로그인 버튼
 * - 로그인: 작성 / 본인 댓글 삭제
 * - 관리자: 모든 댓글 삭제
 * - Firebase 미설정: '준비 중' 안내만 표시
 */
export default function Discussion(props: Props) {
  const { enabled } = useAuth()
  return (
    <section aria-labelledby="discussion-title" className="mt-16 border-t border-stone-200 pt-10 dark:border-stone-800">
      <h2 id="discussion-title" className="font-serif text-2xl font-bold text-stone-900 dark:text-stone-50">
        토론
      </h2>
      {enabled ? (
        // key: 다른 자료로 이동하면 상태를 새로 시작
        <DiscussionBody key={`${props.targetType}:${props.targetId}`} {...props} />
      ) : (
        <p className="mt-4 rounded-lg border border-dashed border-stone-300 bg-white px-4 py-6 text-center text-stone-600 dark:border-stone-700 dark:bg-stone-900 dark:text-stone-400">
          토론 기능 준비 중입니다. 곧 이 자료에 대해 의견을 나눌 수 있어요.
        </p>
      )}
    </section>
  )
}

function DiscussionBody({ targetType, targetId }: Props) {
  const { user, loading: authLoading } = useAuth()
  const [comments, setComments] = useState<Comment[]>([])
  const [cursor, setCursor] = useState<unknown>(null)
  const [hasMore, setHasMore] = useState(false)
  const [status, setStatus] = useState<'idle' | 'loading' | 'ready' | 'error'>('idle')
  const [loadingMore, setLoadingMore] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const sectionRef = useRef<HTMLDivElement>(null)

  // 읽기 비용 절약: 토론 영역이 화면 근처에 왔을 때 처음 한 번만 조회
  useEffect(() => {
    const el = sectionRef.current
    if (!el) return
    let cancelled = false
    const load = async () => {
      setStatus('loading')
      try {
        const page = await fetchComments(targetType, targetId)
        if (cancelled) return
        setComments(page.comments)
        setCursor(page.cursor)
        setHasMore(page.hasMore)
        setStatus('ready')
      } catch (err) {
        if (cancelled) return
        console.error(err)
        setError(commentErrorMessage(err))
        setStatus('error')
      }
    }
    if (!('IntersectionObserver' in window)) {
      void load()
      return () => {
        cancelled = true
      }
    }
    const io = new IntersectionObserver(
      (entries) => {
        if (entries.some((e) => e.isIntersecting)) {
          io.disconnect()
          void load()
        }
      },
      { rootMargin: '300px' },
    )
    io.observe(el)
    return () => {
      cancelled = true
      io.disconnect()
    }
  }, [targetType, targetId])

  const loadMore = async () => {
    if (!cursor) return
    setLoadingMore(true)
    try {
      const page = await fetchComments(targetType, targetId, cursor)
      setComments((prev) => [...prev, ...page.comments.filter((c) => !prev.some((p) => p.id === c.id))])
      setCursor(page.cursor)
      setHasMore(page.hasMore)
    } catch (err) {
      setError(commentErrorMessage(err))
    } finally {
      setLoadingMore(false)
    }
  }

  const handleDelete = async (c: Comment) => {
    if (!confirm('이 댓글을 삭제할까요? 삭제 후에는 되돌릴 수 없습니다.')) return
    try {
      await deleteComment(c)
      setComments((prev) => prev.filter((p) => p.id !== c.id))
    } catch (err) {
      alert(commentErrorMessage(err))
    }
  }

  return (
    <div ref={sectionRef} className="mt-6 space-y-8">
      {authLoading ? null : user ? (
        <CommentForm
          onSubmit={async (text) => {
            const created = await addComment({
              targetType,
              targetId,
              text,
              authorUid: user.uid,
              authorName: user.displayName,
            })
            setComments((prev) => [created, ...prev])
          }}
          authorName={user.displayName}
        />
      ) : (
        <LoginPrompt />
      )}

      {error && (
        <p role="alert" className="rounded bg-red-50 px-4 py-3 text-sm text-red-800 dark:bg-red-950 dark:text-red-200">
          {error}
        </p>
      )}

      <div aria-live="polite" aria-busy={status === 'loading'}>
        {(status === 'idle' || status === 'loading') && <p className="text-stone-500">댓글을 불러오는 중…</p>}
        {status === 'ready' && comments.length === 0 && (
          <p className="text-stone-500">아직 댓글이 없습니다. 첫 의견을 남겨 주세요.</p>
        )}
        {comments.length > 0 && (
          <ul className="space-y-4">
            {comments.map((c) => {
              const canDelete = !!user && (user.uid === c.authorUid || user.isAdmin)
              return (
                <li key={c.id} className="rounded-lg border border-stone-200 bg-white p-4 dark:border-stone-800 dark:bg-stone-900">
                  <div className="flex flex-wrap items-baseline justify-between gap-2">
                    <p className="text-sm">
                      <span className="font-semibold text-stone-900 dark:text-stone-100">{c.authorName}</span>
                      {c.createdAt && (
                        <time dateTime={c.createdAt.toISOString()} className="ml-2 text-stone-500">
                          {dateFormat.format(c.createdAt)}
                        </time>
                      )}
                    </p>
                    {canDelete && (
                      <button
                        type="button"
                        onClick={() => handleDelete(c)}
                        className="rounded px-2 py-1 text-sm text-stone-500 hover:bg-red-50 hover:text-red-700 dark:hover:bg-red-950 dark:hover:text-red-300"
                      >
                        삭제{user && user.uid !== c.authorUid ? ' (관리자)' : ''}
                      </button>
                    )}
                  </div>
                  <p className="mt-2 whitespace-pre-wrap text-stone-800 dark:text-stone-200">{c.text}</p>
                </li>
              )
            })}
          </ul>
        )}
        {hasMore && (
          <div className="mt-6 text-center">
            <button
              type="button"
              onClick={loadMore}
              disabled={loadingMore}
              className="rounded border border-stone-300 px-5 py-2 text-sm hover:bg-stone-100 disabled:opacity-50 dark:border-stone-700 dark:hover:bg-stone-800"
            >
              {loadingMore ? '불러오는 중…' : '더 보기'}
            </button>
          </div>
        )}
      </div>
    </div>
  )
}

function LoginPrompt() {
  const [busy, setBusy] = useState(false)
  return (
    <div className="rounded-lg border border-stone-200 bg-white px-4 py-6 text-center dark:border-stone-800 dark:bg-stone-900">
      <button
        type="button"
        disabled={busy}
        onClick={async () => {
          setBusy(true)
          try {
            await signInWithGoogle()
          } catch (err) {
            const msg = authErrorMessage(err)
            if (msg) alert(msg)
          } finally {
            setBusy(false)
          }
        }}
        className="rounded bg-accent-700 px-5 py-2.5 font-medium text-white hover:bg-accent-800 disabled:opacity-50"
      >
        구글로 로그인하고 토론에 참여하기
      </button>
      <p className="mt-3 text-sm text-stone-500">로그인 없이도 댓글은 읽을 수 있습니다.</p>
    </div>
  )
}

function CommentForm({ onSubmit, authorName }: { onSubmit: (text: string) => Promise<void>; authorName: string }) {
  const [text, setText] = useState('')
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const length = text.trim().length

  const submit = async (e: FormEvent) => {
    e.preventDefault()
    const v = validateCommentText(text)
    if (v) return setError(v)
    setBusy(true)
    setError(null)
    try {
      await onSubmit(text)
      setText('')
    } catch (err) {
      setError(commentErrorMessage(err))
    } finally {
      setBusy(false)
    }
  }

  return (
    <form onSubmit={submit} className="space-y-2">
      <label htmlFor="comment-text" className="block text-sm text-stone-600 dark:text-stone-400">
        <span className="font-semibold text-stone-800 dark:text-stone-200">{authorName}</span> 이름으로 댓글을 남깁니다
      </label>
      <textarea
        id="comment-text"
        value={text}
        onChange={(e) => setText(e.target.value)}
        maxLength={MAX_COMMENT_LENGTH + 100 /* 앞뒤 공백 여유. 최종 검사는 trim 후 1000자 */}
        rows={4}
        placeholder="자료를 읽고 든 생각이나 질문을 남겨 주세요."
        aria-describedby="comment-help"
        aria-invalid={!!error}
        className="w-full rounded-lg border border-stone-300 bg-white px-3 py-2 text-base focus:border-accent-600 dark:border-stone-700 dark:bg-stone-900"
      />
      <div className="flex items-center justify-between gap-3">
        <p id="comment-help" className={`text-sm ${length > MAX_COMMENT_LENGTH ? 'text-red-700 dark:text-red-300' : 'text-stone-500'}`}>
          {length} / {MAX_COMMENT_LENGTH}자
        </p>
        <button
          type="submit"
          disabled={busy || length === 0 || length > MAX_COMMENT_LENGTH}
          className="rounded bg-accent-700 px-5 py-2 text-sm font-medium text-white hover:bg-accent-800 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {busy ? '등록 중…' : '댓글 등록'}
        </button>
      </div>
      {error && (
        <p role="alert" className="text-sm text-red-700 dark:text-red-300">
          {error}
        </p>
      )}
    </form>
  )
}
