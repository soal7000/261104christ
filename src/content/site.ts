// 사이트 전역 설정 파일입니다.
// 교수님이 직접 수정해도 되는 부분: 사이트명, 소개 문구, 연락처, 관리자 이메일 등.

export const site = {
  /** 사이트 이름 (헤더·브라우저 탭에 표시) */
  name: 'Tabula Rasa Lab',
  /** 한 줄 소개 (홈 상단) */
  tagline: '인성교육 연구와 수업 자료를 함께 읽고 토론하는 공간',
  /** 운영자(교수) 정보 */
  professor: {
    name: '이재열',
    title: '교수',
    affiliation: 'Tabula Rasa · 인성교육',
    /** 소개 문단. 여러 문단은 배열로 나눠 적습니다. */
    bio: [
      '인성교육과 도덕 발달을 연구합니다. "빈 서판(Tabula Rasa)"이라는 이름처럼, 배움은 정해진 답을 채워 넣는 일이 아니라 함께 질문을 새로 써 가는 일이라고 믿습니다.',
      '이 사이트에는 연구 결과와 수업 자료를 정리해 두었습니다. 학생 여러분은 각 자료 아래 토론 영역에서 자유롭게 의견을 나눠 주세요.',
    ],
    /** 연구 관심 분야 */
    interests: ['인성교육', '도덕 발달', '교사 교육', '교육철학'],
  },
  /** 연락처 (빈 문자열이면 표시하지 않음) */
  contact: {
    email: 'professor@example.ac.kr',
    office: '인문관 000호',
    officeHours: '화·목 14:00–16:00 (사전 메일 예약)',
  },
  /**
   * 관리자(교수) 구글 이메일 목록.
   * 화면에서 '모든 댓글 삭제' 버튼을 보여줄지 판단하는 데만 쓰입니다.
   * 실제 삭제 권한은 저장소 루트의 firestore.rules 에 적은 이메일이 결정하므로 두 곳을 같게 맞추세요.
   */
  adminEmails: ['professor@example.com'],
  /** 홈에 보여줄 최신 연구 개수 */
  homeResearchCount: 3,
}

export type SiteConfig = typeof site
