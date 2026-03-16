'use client'

import { createClient } from '@/lib/supabase/client'
import { LogOut } from 'lucide-react'
import { useRouter } from 'next/navigation'

export function LogoutButton() {
  const router = useRouter()
  const supabase = createClient()

  const handleLogout = async () => {
    await supabase.auth.signOut()
    router.push('/admin-login')
    router.refresh()
  }

  return (
    <button
      onClick={handleLogout}
      className="flex items-center gap-2 text-sm text-gray-600 hover:text-red-600 transition-colors"
    >
      <LogOut className="w-4 h-4" />
      <span className="hidden sm:inline">Logout</span>
    </button>
  )
}
