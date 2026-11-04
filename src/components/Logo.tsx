import { Link } from 'react-router-dom'
import { site } from '../content/site'

/** 로고: 서판을 상징하는 사각 마크 + 사이트명 */
export default function Logo() {
  return (
    <Link to="/" className="group flex items-center gap-2.5" aria-label={`${site.name} 홈`}>
      <span className="grid h-8 w-8 place-items-center rounded-md bg-accent font-serif text-[0.8rem] font-bold text-accent-ink" aria-hidden="true">
        TR
      </span>
      <span className="font-serif text-[1.05rem] font-bold tracking-tight text-ink">{site.name}</span>
    </Link>
  )
}
