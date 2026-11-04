import { Route, Routes } from 'react-router-dom'
import Layout from './components/Layout'
import Home from './pages/Home'
import ResearchList from './pages/ResearchList'
import ResearchDetail from './pages/ResearchDetail'
import CourseList from './pages/CourseList'
import CourseDetail from './pages/CourseDetail'
import About from './pages/About'
import NotFound from './pages/NotFound'

/** 라우팅 정의 (Netlify에서는 netlify.toml 의 SPA 리다이렉트가 필요합니다) */
export default function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route index element={<Home />} />
        <Route path="research" element={<ResearchList />} />
        <Route path="research/:id" element={<ResearchDetail />} />
        <Route path="courses" element={<CourseList />} />
        <Route path="courses/:id" element={<CourseDetail />} />
        <Route path="about" element={<About />} />
        <Route path="*" element={<NotFound />} />
      </Route>
    </Routes>
  )
}
