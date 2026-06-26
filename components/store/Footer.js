'use client'

import { useTheme } from '@/contexts/ThemeContext'
import UrbanFashionFooter from './themes/urban-fashion/Footer'
import HappyHobbyFooter from './themes/happy-hobby/Footer'

export default function Footer() {
  const ctx = useTheme()
  if (ctx?.template === 'happy-hobby') return <HappyHobbyFooter />
  return <UrbanFashionFooter />
}
