/** 이름 첫 글자로 만든 원형 아바타 (외부 프로필 사진을 불러오지 않아 개인정보·트래픽 절약) */
const TONES = ['#1f3a5f', '#5b4636', '#3d5a4a', '#5a3d5c', '#6b4f1d', '#2f4f6f']

export default function Avatar({ name, size = 'md' }: { name: string; size?: 'sm' | 'md' }) {
  const initial = (name.trim()[0] ?? '?').toUpperCase()
  let hash = 0
  for (const ch of name) hash = (hash * 31 + ch.charCodeAt(0)) >>> 0
  const dim = size === 'sm' ? 'h-7 w-7 text-xs' : 'h-9 w-9 text-sm'
  return (
    <span
      aria-hidden="true"
      className={`grid shrink-0 place-items-center rounded-full font-semibold text-white ${dim}`}
      style={{ backgroundColor: TONES[hash % TONES.length] }}
    >
      {initial}
    </span>
  )
}
