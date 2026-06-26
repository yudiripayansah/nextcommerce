'use client'

import { useTheme } from '@/contexts/ThemeContext'
import UrbanFashionHeader from './themes/urban-fashion/Header'
import HappyHobbyHeader from './themes/happy-hobby/Header'

export default function Header() {
  const ctx = useTheme()
  if (ctx?.template === 'happy-hobby') return <HappyHobbyHeader />
  return <UrbanFashionHeader />
}
