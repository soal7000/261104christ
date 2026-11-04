import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// Vite 설정: React + Tailwind CSS v4 플러그인
export default defineConfig({
  plugins: [react(), tailwindcss()],
  build: {
    // Firestore SDK 청크(약 580KB)는 토론 영역이 열릴 때만 동적으로 불러오므로 경고 한도를 올려 둡니다.
    chunkSizeWarningLimit: 700,
  },
})
