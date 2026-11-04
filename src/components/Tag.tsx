/** 태그 표시용 작은 배지 */
export default function Tag({ children }: { children: string }) {
  return (
    <span className="inline-block rounded-full bg-accent-50 px-2.5 py-0.5 text-xs text-accent-700 dark:bg-stone-800 dark:text-accent-300">
      #{children}
    </span>
  )
}
