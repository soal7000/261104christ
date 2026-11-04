import { courseList } from '../content'
import CourseCard from '../components/CourseCard'
import PageHeader from '../components/PageHeader'
import { useDocumentTitle } from '../hooks/useDocumentTitle'

export default function CourseList() {
  useDocumentTitle('수업')
  return (
    <div>
      <PageHeader eyebrow="Courses" title="수업">
        수업별 강의 자료를 모았습니다. 각 수업 페이지에서 질문과 토론을 남겨 주세요.
      </PageHeader>
      <div className="grid gap-4 md:grid-cols-2">
        {courseList.map((c) => (
          <CourseCard key={c.id} item={c} />
        ))}
      </div>
    </div>
  )
}
