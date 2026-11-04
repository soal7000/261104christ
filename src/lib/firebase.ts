// Firebase 초기화 모듈.
// - 사용 기능: Authentication(구글 로그인) + Firestore 뿐입니다. (Spark 무료 요금제 범위)
// - Cloud Functions / Storage / Hosting 등 유료·불필요 기능은 사용하지 않습니다.
// - 환경변수가 "모두" 있을 때만 초기화하고, 하나라도 없으면 isFirebaseEnabled = false 입니다.
//
// 이 파일 상단(설정 판별)은 Firebase SDK를 import 하지 않습니다.
// 실제 SDK는 getFirebase()가 처음 호출될 때 동적으로 불러오므로,
// Firebase 미설정 상태에서는 SDK 코드가 아예 내려받아지지 않습니다.
import type { FirebaseApp } from 'firebase/app'
import type { Auth } from 'firebase/auth'
import type { Firestore } from 'firebase/firestore'

const config = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY as string | undefined,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN as string | undefined,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID as string | undefined,
  appId: import.meta.env.VITE_FIREBASE_APP_ID as string | undefined,
}

/** 필수 환경변수 4개가 모두 채워져 있는지 여부 */
export const isFirebaseEnabled: boolean = Object.values(config).every((v) => typeof v === 'string' && v.trim() !== '')

export interface FirebaseHandles {
  app: FirebaseApp
  auth: Auth
  db: Firestore
}

let handlesPromise: Promise<FirebaseHandles> | null = null

/** Firebase 인스턴스를 (한 번만) 초기화해서 돌려줍니다. 비활성 상태에서 호출하면 에러를 던집니다. */
export function getFirebase(): Promise<FirebaseHandles> {
  if (!isFirebaseEnabled) {
    return Promise.reject(new Error('Firebase가 설정되지 않았습니다. (.env 확인)'))
  }
  if (!handlesPromise) {
    handlesPromise = (async () => {
      const [{ initializeApp }, { getAuth }, { getFirestore }] = await Promise.all([
        import('firebase/app'),
        import('firebase/auth'),
        import('firebase/firestore'),
      ])
      const app = initializeApp(config as Required<typeof config>)
      return { app, auth: getAuth(app), db: getFirestore(app) }
    })()
  }
  return handlesPromise
}
