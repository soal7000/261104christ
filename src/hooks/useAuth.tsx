// 로그인 상태를 앱 전체에 공유하는 React 컨텍스트
import { createContext, useContext, useEffect, useState, type ReactNode } from 'react'
import { watchAuth, type AppUser } from '../services/auth'
import { isFirebaseEnabled } from '../lib/firebase'

interface AuthState {
  user: AppUser | null
  /** 첫 로그인 상태 확인이 끝나기 전이면 true */
  loading: boolean
  /** Firebase 설정 여부 (false면 로그인·토론 '준비 중') */
  enabled: boolean
}

const AuthContext = createContext<AuthState>({ user: null, loading: false, enabled: false })

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AppUser | null>(null)
  const [loading, setLoading] = useState(isFirebaseEnabled)

  useEffect(
    () =>
      watchAuth((u) => {
        setUser(u)
        setLoading(false)
      }),
    [],
  )

  return <AuthContext.Provider value={{ user, loading, enabled: isFirebaseEnabled }}>{children}</AuthContext.Provider>
}

export const useAuth = () => useContext(AuthContext)
