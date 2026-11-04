// 댓글 서비스: Firestore 접근은 모두 이 파일을 거칩니다.
// 무료 한도 절약 원칙
//  - 실시간 리스너(onSnapshot) 대신 getDocs 로 필요할 때만 조회
//  - 한 번에 PAGE_SIZE(20)개씩 limit + "더 보기" 커서 페이지네이션
//  - 같은 대상의 첫 페이지는 메모리에 캐시하여 페이지 재방문 시 재조회하지 않음
import type { DocumentSnapshot } from 'firebase/firestore'
import { getFirebase } from '../lib/firebase'

export type TargetType = 'research' | 'course'

export interface Comment {
  id: string
  targetType: TargetType
  targetId: string
  text: string
  authorUid: string
  authorName: string
  /** 서버 시간. 방금 작성해 아직 확정되지 않은 경우 null */
  createdAt: Date | null
}

export interface CommentPage {
  comments: Comment[]
  /** 다음 페이지 조회용 커서 (없으면 마지막 페이지) */
  cursor: unknown | null
  hasMore: boolean
}

export const PAGE_SIZE = 20
export const MAX_COMMENT_LENGTH = 1000

const COLLECTION = 'comments'
const CACHE_TTL_MS = 60_000 // 1분 이내 재방문 시 캐시 사용

const cache = new Map<string, { page: CommentPage; at: number }>()
const cacheKey = (t: TargetType, id: string) => `${t}:${id}`

/** 입력 검증. 문제가 있으면 한국어 에러 메시지, 없으면 null */
export function validateCommentText(text: string): string | null {
  const trimmed = text.trim()
  if (!trimmed) return '내용을 입력해 주세요. (공백만 있는 댓글은 등록할 수 없습니다)'
  if (trimmed.length > MAX_COMMENT_LENGTH) return `댓글은 최대 ${MAX_COMMENT_LENGTH}자까지 작성할 수 있습니다.`
  return null
}

function toComment(snap: DocumentSnapshot): Comment {
  const d = snap.data() ?? {}
  return {
    id: snap.id,
    targetType: d.targetType,
    targetId: d.targetId,
    text: d.text,
    authorUid: d.authorUid,
    authorName: d.authorName,
    createdAt: d.createdAt?.toDate?.() ?? null,
  }
}

/**
 * 댓글 목록 조회 (최신순).
 * cursor 없이 호출하면 첫 페이지(캐시 사용), cursor를 넘기면 다음 페이지.
 * 필요한 복합 인덱스: targetType ASC, targetId ASC, createdAt DESC (README/firestore.indexes.json 참고)
 */
export async function fetchComments(
  targetType: TargetType,
  targetId: string,
  cursor?: unknown,
  options: { force?: boolean } = {},
): Promise<CommentPage> {
  const key = cacheKey(targetType, targetId)
  if (!cursor && !options.force) {
    const hit = cache.get(key)
    if (hit && Date.now() - hit.at < CACHE_TTL_MS) return hit.page
  }

  const [{ db }, fs] = await Promise.all([getFirebase(), import('firebase/firestore')])
  const constraints = [
    fs.where('targetType', '==', targetType),
    fs.where('targetId', '==', targetId),
    fs.orderBy('createdAt', 'desc'),
    ...(cursor ? [fs.startAfter(cursor as DocumentSnapshot)] : []),
    // hasMore 판단을 위해 1개 더 읽지 않고, 정확히 PAGE_SIZE 만큼만 읽습니다(읽기 비용 절약).
    fs.limit(PAGE_SIZE),
  ]
  const snap = await fs.getDocs(fs.query(fs.collection(db, COLLECTION), ...constraints))
  const docs = snap.docs
  const page: CommentPage = {
    comments: docs.map(toComment),
    cursor: docs.length ? docs[docs.length - 1] : null,
    hasMore: docs.length === PAGE_SIZE,
  }
  if (!cursor) cache.set(key, { page, at: Date.now() })
  return page
}

/** 댓글 작성. 성공 시 화면에 바로 추가할 수 있도록 Comment 를 돌려줍니다. (추가 읽기 없음) */
export async function addComment(params: {
  targetType: TargetType
  targetId: string
  text: string
  authorUid: string
  authorName: string
}): Promise<Comment> {
  const error = validateCommentText(params.text)
  if (error) throw new Error(error)
  const [{ db }, fs] = await Promise.all([getFirebase(), import('firebase/firestore')])
  const text = params.text.trim()
  // 보안 규칙과 동일한 필드만 저장합니다. (필드를 추가하려면 firestore.rules 도 함께 수정)
  const ref = await fs.addDoc(fs.collection(db, COLLECTION), {
    targetType: params.targetType,
    targetId: params.targetId,
    text,
    authorUid: params.authorUid,
    authorName: params.authorName,
    createdAt: fs.serverTimestamp(),
  })
  cache.delete(cacheKey(params.targetType, params.targetId))
  return { id: ref.id, ...params, text, createdAt: new Date() }
}

/** 댓글 삭제. 권한(본인/관리자)은 Firestore 보안 규칙이 최종 판단합니다. */
export async function deleteComment(comment: Pick<Comment, 'id' | 'targetType' | 'targetId'>): Promise<void> {
  const [{ db }, fs] = await Promise.all([getFirebase(), import('firebase/firestore')])
  await fs.deleteDoc(fs.doc(db, COLLECTION, comment.id))
  cache.delete(cacheKey(comment.targetType, comment.targetId))
}

/** Firestore 에러를 사용자 메시지로 변환 */
export function commentErrorMessage(err: unknown): string {
  const code = (err as { code?: string })?.code ?? ''
  if (code === 'permission-denied') return '권한이 없습니다. 로그인 상태를 확인해 주세요.'
  if (code === 'failed-precondition')
    return '댓글 조회용 인덱스가 아직 준비되지 않았습니다. (관리자: README의 "복합 인덱스" 항목 참고)'
  if (code === 'resource-exhausted') return '오늘 사용 가능한 무료 한도를 초과했습니다. 내일 다시 시도해 주세요.'
  if (code === 'unavailable') return '네트워크 연결을 확인해 주세요.'
  if (err instanceof Error && !code) return err.message
  return '요청을 처리하지 못했습니다. 잠시 후 다시 시도해 주세요.'
}
