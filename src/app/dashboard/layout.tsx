import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import { LayoutDashboard, Settings } from 'lucide-react'
import { LogoutButton } from '@/components/LogoutButton'

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return redirect('/admin-login')
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Sidebar / Navigation */}
      <nav className="bg-white border-b border-gray-200 fixed z-30 w-full top-0">
        <div className="px-4 xl:px-8 py-3 flex justify-between items-center">
            <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center text-white font-bold">
                    L
                </div>
                <span className="text-xl font-bold text-gray-900 hidden sm:block">LinktreeAdmin</span>
            </div>
            <div className="flex items-center gap-4">
                <div className="text-sm text-gray-600 hidden md:block">{user.email}</div>
                <LogoutButton />
            </div>
        </div>
      </nav>

      <div className="flex pt-16 min-h-screen">
          <aside className="w-64 bg-white border-r border-gray-200 hidden md:block fixed h-full z-20 top-16">
              <div className="py-6 px-4 space-y-2">
                  <Link href="/dashboard" className="flex items-center gap-3 px-4 py-3 text-sm font-medium rounded-lg bg-blue-50 text-blue-700">
                      <LayoutDashboard className="w-5 h-5" />
                      Links & Analytics
                  </Link>
                  <Link href="/dashboard/settings" className="flex items-center gap-3 px-4 py-3 text-sm font-medium rounded-lg text-gray-600 hover:bg-gray-50">
                      <Settings className="w-5 h-5" />
                      Settings
                  </Link>
              </div>
          </aside>

          <main className="flex-1 md:ml-64 p-4 md:p-8 w-full max-w-7xl mx-auto">
              {children}
          </main>
      </div>
    </div>
  )
}
