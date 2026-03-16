import { getLinks } from '@/app/actions/links'
import Link from 'next/link'
import { Link as LinkIcon, Download } from 'lucide-react'

export const revalidate = 60 // Revalidate every 60 seconds

export default async function Home() {
  const links = await getLinks()

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-blue-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-xl mx-auto space-y-8">
        {/* Profile Header */}
        <div className="text-center space-y-4">
          <div className="w-24 h-24 mx-auto bg-gradient-to-tr from-blue-600 to-indigo-600 rounded-full flex items-center justify-center shadow-xl ring-4 ring-white">
            {/* <span className="text-4xl font-bold text-white">🚀</span> */}
            <img src="/global.png" alt="Logo" width={100} height={100} />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">SAMUDAYA</h1>
            <p className="text-gray-500 mt-2 font-medium">Satria Muda Digdaya | Solusi Digital Anda</p>
          </div>
        </div>

        {/* Links Container */}
        <div className="space-y-4">
          {links.length === 0 ? (
            <div className="text-center text-gray-500 py-8 bg-white/50 rounded-2xl border border-white/20 backdrop-blur-sm">
              No files available right now. Check back later!
            </div>
          ) : (
            links.map((link) => (
              <Link
                key={link.id}
                href={`/go/${link.id}`}
                className="group relative flex items-center justify-between p-4 bg-white rounded-2xl shadow-sm hover:shadow-md border border-gray-100 hover:border-blue-100 transition-all hover:-translate-y-0.5"
              >
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 bg-blue-50 rounded-xl flex items-center justify-center group-hover:bg-blue-600 group-hover:text-white transition-colors text-blue-600">
                    <LinkIcon className="w-5 h-5" />
                  </div>
                  <div className="font-semibold text-gray-800 group-hover:text-blue-900 transition-colors">
                    {link.title}
                  </div>
                </div>
                <div className="text-gray-400 group-hover:text-blue-500 transition-colors">
                  <Download className="w-5 h-5" />
                </div>
              </Link>
            ))
          )}
        </div>

        {/* Footer */}
        <div className="mt-16 text-center text-sm text-gray-400 font-medium">
          Safe & Secure Downloads
        </div>
      </div>
    </div>
  )
}
