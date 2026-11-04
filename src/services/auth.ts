// 인증 서비스: UI는 이 파일의 함수만 사용하고 Firebase를 직접 호출하지 않습니다.
import { getFirebase, isFirebaseEnabled } from '../lib/firebase'
import { site } from '../content/site'

/** 화면에서 사용하는 사용자 정보 (Firebase User 타입을 UI에 노출하지 않기 위한 단순 타입) */
export interface AppUser {
  uid: string
  displayName: string
  email: string | null
  photoURL: string | null
  isAdmin: boolean
}

/** 관리자 이메일 목록: 환경변수(VITE_ADMIN_EMAIL, 쉼표 구분) 우선, 없으면 site.ts 값 */
const adminEmails: string[] = (
  (import.meta.env.VITE_ADMIN_EMAIL as string | undefined)?.split(',') ?? site.adminEmails
)
  .map((e) => e.trim().toLowerCase())
  .filter(Boolean)

export const isAdminEmail = (email: string | null | undefined) =>
  !!email && adminEmails.includes(email.toLowerCase())

/**
 * 로그인 상태 변화를 구독합니다. 반환값은 구독 해제 함수입니다.
 * (onAuthStateChanged는 로컬 인증 상태 감시일 뿐 Firestore 읽기 비용이 들지 않습니다.)
 */
export function watchAuth(callback: (user: AppUser | null) => void): () => void {
  if (!isFirebaseEnabled) {
    callback(null)
    return () => {}
  }
  let unsubscribe: (() => void) | null = null
  let cancelled = false
  void (async () => {
    const [{ auth }, { onAuthStateChanged }] = await Promise.all([getFirebase(), import('firebase/auth')])
    if (cancelled) return
    unsubscribe = onAuthStateChanged(auth, (u) => {
      callback(
        u
          ? {
              uid: u.uid,
              displayName: u.displayName || '이름 없음',
              email: u.email,
              photoURL: u.photoURL,
              isAdmin: isAdminEmail(u.email),
            }
          : null,
      )
    })
  })().catch((err) => {
    console.error('[auth] 초기화 실패', err)
    callback(null)
  })
  return () => {
    cancelled = true
    unsubscribe?.()
  }
}

/** 구글 계정으로 로그인 (팝업) */
export async function signInWithGoogle(): Promise<void> {
  const [{ auth }, { GoogleAuthProvider, signInWithPopup }] = await Promise.all([
    getFirebase(),
    import('firebase/auth'),
  ])
  const provider = new GoogleAuthProvider()
  provider.setCustomParameters({ prompt: 'select_account' })
  await signInWithPopup(auth, provider)
}

/** 로그아웃 */
export async function signOutUser(): Promise<void> {
  const [{ auth }, { signOut }] = await Promise.all([getFirebase(), import('firebase/auth')])
  await signOut(auth)
}

/** 로그인 에러를 사용자에게 보여줄 한국어 메시지로 변환 */
export function authErrorMessage(err: unknown): string | null {
  const code = (err as { code?: string })?.code ?? ''
  if (code === 'auth/popup-closed-by-user' || code === 'auth/cancelled-popup-request') return null // 사용자가 닫음: 메시지 없음
  if (code === 'auth/unauthorized-domain')
    return '이 도메인은 로그인이 허용되지 않았습니다. (Firebase 콘솔 → Authentication → 승인된 도메인 확인)'
  if (code === 'auth/popup-blocked') return '팝업이 차단되었습니다. 브라우저에서 팝업을 허용해 주세요.'
  return '로그인에 실패했습니다. 잠시 후 다시 시도해 주세요.'
}
