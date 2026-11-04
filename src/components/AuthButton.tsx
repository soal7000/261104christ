import { useState } from 'react'
import { useAuth } from '../hooks/useAuth'
import { authErrorMessage, signInWithGoogle, signOutUser } from '../services/auth'
import Avatar from './Avatar'

/** 헤더 로그인/로그아웃 버튼. Firebase 미설정 시 '준비 중'으로 비활성화됩니다. */
export default function AuthButton() {
  const { user, loading, enabled } = useAuth()
  const [busy, setBusy] = useState(false)

  if (!enabled) {
    return (
      <button
        type="button"
        disabled
        className="inline-flex cursor-not-allowed items-center gap-1.5 rounded-lg border border-dashed border-line px-3 py-1.5 text-sm text-ink-3"
        title="로그인 기능은 곧 열립니다"
      >
        로그인 <span className="text-xs">(준비 중)</span>
      </button>
    )
  }

  if (loading) {
    return <span className="px-3 py-1.5 text-sm text-ink-3">확인 중…</span>
  }

  const run = async (fn: () => Promise<void>) => {
    setBusy(true)
    try {
      await fn()
    } catch (err) {
      const msg = authErrorMessage(err)
      if (msg) alert(msg)
    } finally {
      setBusy(false)
    }
  }

  if (user) {
    return (
      <div className="flex items-center gap-2.5">
        <Avatar name={user.displayName} size="sm" />
        <span className="max-w-[9rem] truncate text-sm text-ink" title={user.email ?? undefined}>
          {user.displayName}
          {user.isAdmin && <span className="ml-1.5 rounded bg-accent-soft px-1.5 py-0.5 text-[0.7rem] font-semibold text-accent-text">관리자</span>}
        </span>
        <button
          type="button"
          disabled={busy}
          onClick={() => run(signOutUser)}
          className="rounded-lg px-2.5 py-1.5 text-sm text-ink-3 hover:bg-surface hover:text-ink disabled:opacity-50"
        >
          로그아웃
        </button>
      </div>
    )
  }

  return (
    <button type="button" disabled={busy} onClick={() => run(signInWithGoogle)} className="btn-primary px-4 py-1.5 text-sm">
      구글 로그인
    </button>
  )
}
