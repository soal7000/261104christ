// 콘텐츠(연구·수업) 타입 정의와 불러오기 함수.
// 데이터는 Firestore가 아니라 저장소 안의 JSON/Markdown 파일에서 읽으므로 DB 비용이 들지 않습니다.
import researchData from './research.json'
import coursesData from './courses.json'

export interface LinkItem {
  label: string
  url: string
}

export interface Research {
  id: string
  title: string
  summary: string
  year: number
  tags: string[]
  links: LinkItem[]
  /** 마크다운 파일 경로(예: "research/abc.md") 또는 짧은 마크다운 본문 */
  body: string
}

export interface Course {
  id: string
  title: string
  semester: string
  description: string
  materials: LinkItem[]
}

/** 연구 목록 (연도 내림차순 정렬) */
export const researchList: Research[] = [...(researchData as Research[])].sort((a, b) => b.year - a.year)

/** 수업 목록 (JSON에 적힌 순서 유지) */
export const courseList: Course[] = coursesData as Course[]

export const findResearch = (id: string) => researchList.find((r) => r.id === id)
export const findCourse = (id: string) => courseList.find((c) => c.id === id)

/** 전체 태그 목록 (가나다순, 중복 제거) */
export const allTags: string[] = Array.from(new Set(researchList.flatMap((r) => r.tags))).sort((a, b) =>
  a.localeCompare(b, 'ko'),
)

// src/content 아래 모든 .md 파일을 "필요할 때만" 불러오도록 등록 (상세 페이지에서만 로드됨)
const markdownFiles = import.meta.glob('./**/*.md', { query: '?raw', import: 'default' }) as Record<
  string,
  () => Promise<string>
>

/**
 * body 값이 .md 경로이면 해당 파일 내용을, 아니면 body 자체를 마크다운 본문으로 돌려줍니다.
 */
export async function loadBody(body: string): Promise<string> {
  const trimmed = body.trim()
  if (!trimmed.endsWith('.md')) return body
  const key = './' + trimmed.replace(/^\.?\//, '')
  const loader = markdownFiles[key]
  if (!loader) return `> 본문 파일을 찾을 수 없습니다: \`${trimmed}\``
  return loader()
}
