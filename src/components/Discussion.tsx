import { useEffect, useRef, useState, type FormEvent } from 'react'
import { useAuth } from '../hooks/useAuth'
import Avatar from './Avatar'
import Icon from './Icon'
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
    <section id="discussion" aria-labelledby="discussion-title" className="mt-20 scroll-mt-24 border-t-2 border-ink pt-8">
      <div className="flex items-center gap-2.5">
        <Icon name="chat" className="h-6 w-6 text-accent-text" />
        <h2 id="discussion-title" className="section-title">
          토론
        </h2>
      </div>
      <p className="mt-2 text-sm text-ink-3">이 자료를 읽고 든 생각과 질문을 자유롭게 나눠 주세요. 서로의 의견을 존중해 주세요.</p>
      {enabled ? (
        // key: 다른 자료로 이동하면 상태를 새로 시작
        <DiscussionBody key={`${props.targetType}:${props.targetId}`} {...props} />
      ) : (
        <div className="mt-6 flex flex-col items-center gap-3 rounded-xl border border-dashed border-line bg-surface px-6 py-10 text-center">
          <span className="grid h-12 w-12 place-items-center rounded-full bg-accent-soft text-accent-text">
            <Icon name="chat" className="h-6 w-6" />
          </span>
          <p className="font-semibold text-ink">토론 기능 준비 중입니다.</p>
          <p className="text-sm text-ink-3">곧 이 자료에 대해 의견을 나눌 수 있어요.</p>
        </div>
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
        <p role="alert" className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800 dark:border-red-900 dark:bg-red-950 dark:text-red-200">
          {error}
        </p>
      )}

      <div aria-live="polite" aria-busy={status === 'loading'}>
        {(status === 'idle' || status === 'loading') && <p className="text-ink-3">댓글을 불러오는 중…</p>}
        {status === 'ready' && comments.length === 0 && (
          <p className="py-6 text-center text-ink-3">아직 댓글이 없습니다. 첫 의견을 남겨 주세요.</p>
        )}
        {comments.length > 0 && (
          <ul className="divide-y divide-line">
            {comments.map((c) => {
              const canDelete = !!user && (user.uid === c.authorUid || user.isAdmin)
              return (
                <li key={c.id} className="flex gap-3.5 py-5">
                  <Avatar name={c.authorName} />
                  <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-baseline justify-between gap-x-2">
                    <p className="text-sm">
                      <span className="font-semibold text-ink">{c.authorName}</span>
                      {c.createdAt && (
                        <time dateTime={c.createdAt.toISOString()} className="ml-2 text-xs text-ink-3">
                          {dateFormat.format(c.createdAt)}
                        </time>
                      )}
                    </p>
                    {canDelete && (
                      <button
                        type="button"
                        onClick={() => handleDelete(c)}
                        className="rounded-md px-2 py-0.5 text-xs text-ink-3 hover:bg-red-50 hover:text-red-700 dark:hover:bg-red-950 dark:hover:text-red-300"
                      >
                        삭제{user && user.uid !== c.authorUid ? ' (관리자)' : ''}
                      </button>
                    )}
                  </div>
                  <p className="mt-1.5 whitespace-pre-wrap text-ink-2">{c.text}</p>
                  </div>
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
              className="btn-ghost text-sm"
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
    <div className="rounded-xl border border-line bg-surface px-6 py-8 text-center">
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
        className="btn-primary"
      >
        <Icon name="login" className="h-4 w-4" />
        구글로 로그인하고 토론에 참여하기
      </button>
      <p className="mt-3 text-sm text-ink-3">로그인 없이도 댓글은 읽을 수 있습니다.</p>
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
    <form onSubmit={submit} className="rounded-xl border border-line bg-surface p-4 focus-within:border-accent sm:p-5">
      <label htmlFor="comment-text" className="flex items-center gap-2.5 text-sm text-ink-3">
        <Avatar name={authorName} size="sm" />
        <span>
          <span className="font-semibold text-ink">{authorName}</span> 이름으로 댓글을 남깁니다
        </span>
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
        className="mt-3 w-full resize-y border-0 bg-transparent p-0 text-base text-ink placeholder:text-ink-3 focus:outline-none"
      />
      <div className="mt-2 flex items-center justify-between gap-3 border-t border-line pt-3">
        <p id="comment-help" className={`text-xs tabular-nums ${length > MAX_COMMENT_LENGTH ? 'text-red-700 dark:text-red-300' : 'text-ink-3'}`}>
          {length} / {MAX_COMMENT_LENGTH}자
        </p>
        <button
          type="submit"
          disabled={busy || length === 0 || length > MAX_COMMENT_LENGTH}
          className="btn-primary px-4 py-2 text-sm"
        >
          {busy ? '등록 중…' : '댓글 등록'}
        </button>
      </div>
      {error && (
        <p role="alert" className="mt-2 text-sm text-red-700 dark:text-red-300">
          {error}
        </p>
      )}
    </form>
  )
}
