import { useState } from 'react'
import { useAuth } from '../hooks/useAuth'
import { authErrorMessage, signInWithGoogle, signOutUser } from '../services/auth'

/** 헤더 로그인/로그아웃 버튼. Firebase 미설정 시 '준비 중'으로 비활성화됩니다. */
export default function AuthButton() {
  const { user, loading, enabled } = useAuth()
  const [busy, setBusy] = useState(false)

  if (!enabled) {
    return (
      <button
        type="button"
        disabled
        className="cursor-not-allowed rounded border border-stone-300 px-3 py-1.5 text-sm text-stone-500 dark:border-stone-700 dark:text-stone-500"
        title="로그인 기능은 곧 열립니다"
      >
        로그인 (준비 중)
      </button>
    )
  }

  if (loading) {
    return <span className="px-3 py-1.5 text-sm text-stone-500">확인 중…</span>
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
      <div className="flex items-center gap-2">
        <span className="max-w-[10rem] truncate text-sm text-stone-700 dark:text-stone-300" title={user.email ?? undefined}>
          {user.displayName}
          {user.isAdmin && <span className="ml-1 text-xs text-accent-600 dark:text-accent-300">(관리자)</span>}
        </span>
        <button
          type="button"
          disabled={busy}
          onClick={() => run(signOutUser)}
          className="rounded border border-stone-300 px-3 py-1.5 text-sm hover:bg-stone-100 disabled:opacity-50 dark:border-stone-700 dark:hover:bg-stone-800"
        >
          로그아웃
        </button>
      </div>
    )
  }

  return (
    <button
      type="button"
      disabled={busy}
      onClick={() => run(signInWithGoogle)}
      className="rounded bg-accent-700 px-3 py-1.5 text-sm font-medium text-white hover:bg-accent-800 disabled:opacity-50"
    >
      구글 로그인
    </button>
  )
}
