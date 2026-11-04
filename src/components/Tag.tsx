/** 태그 표시용 작은 배지 */
export default function Tag({ children }: { children: string }) {
  return (
    <span className="inline-block rounded-md bg-accent-soft px-2 py-0.5 text-xs font-medium text-accent-text">#{children}</span>
  )
}
