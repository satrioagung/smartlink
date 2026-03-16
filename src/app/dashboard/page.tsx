import { getLinks } from '@/app/actions/links'
import { LinkManager } from '@/components/LinkManager'

export default async function DashboardPage() {
  const initialLinks = await getLinks()

  const totalClicks = initialLinks.reduce((acc, link) => acc + (link.clicks || 0), 0)
  const totalLinks = initialLinks.length

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Overview</h1>
          <p className="text-gray-500 text-sm mt-1">Manage your links and view click analytics</p>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
          <h3 className="text-gray-500 text-sm font-medium">Total Links</h3>
          <p className="text-3xl font-bold text-gray-900 mt-2">{totalLinks}</p>
        </div>
        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
          <h3 className="text-gray-500 text-sm font-medium">Total Clicks</h3>
          <p className="text-3xl font-bold text-gray-900 mt-2">{totalClicks}</p>
        </div>
      </div>

      {/* Link Manager Component (Client Side for Interactivity) */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        <LinkManager initialLinks={initialLinks} />
      </div>
    </div>
  )
}
