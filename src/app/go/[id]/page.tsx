'use client'

import { useEffect, useState, use } from 'react'
import { getLinkById } from '@/app/actions/links'
import { Download, AlertCircle, Clock, ShieldCheck } from 'lucide-react'

// Using React.use to unwrap params
export default function GoPage({ params }: { params: Promise<{ id: string }> }) {
  const unwrappedParams = use(params);
  const { id } = unwrappedParams;
  
  const [linkData, setLinkData] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(false)
  const [countdown, setCountdown] = useState(10)
  const [isReady, setIsReady] = useState(false)

  // Fetch link data
  useEffect(() => {
    async function loadLink() {
      try {
        const data = await getLinkById(id)
        if (data) {
          setLinkData(data)
        } else {
          setError(true)
        }
      } catch {
        setError(true)
      } finally {
        setLoading(false)
      }
    }
    loadLink()
  }, [id])

  // Handle countdown
  useEffect(() => {
    if (loading || error || isReady) return

    if (countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000)
      return () => clearTimeout(timer)
    } else {
        setIsReady(true)
    }
  }, [countdown, loading, error, isReady])

  // Handle the "2 Action" click
  const handleDownloadClick = async () => {
    if (!linkData) return

    try {
      // 1. Send tracking request to backend
      await fetch('/api/track', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ linkId: linkData.id })
      })
    } catch (e) {
      console.error('Tracking failed', e)
    }

    // 2. Open Smartlink in new tab (Pop-under typically needs user gesture, blank is fine)
    window.open(linkData.smartlink_url, '_blank')

    // 3. Open Destination in current tab
    window.location.href = linkData.destination_url
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  if (error || !linkData) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4 text-center">
        <div className="max-w-md w-full bg-white p-8 rounded-2xl shadow-sm border border-red-100">
          <div className="w-16 h-16 bg-red-50 text-red-500 rounded-full flex items-center justify-center mx-auto mb-4">
            <AlertCircle className="w-8 h-8" />
          </div>
          <h1 className="text-xl font-bold text-gray-900 mb-2">Link Not Found</h1>
          <p className="text-gray-500">The link you are looking for does not exist or has been removed.</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 flex items-center justify-center">
      <div className="max-w-md w-full bg-white rounded-3xl p-8 shadow-xl shadow-blue-900/5 text-center border border-gray-100 relative overflow-hidden">
        {/* Decorative background */}
        <div className="absolute top-0 left-0 w-full h-32 bg-gradient-to-br from-blue-600 to-indigo-700 opacity-10"></div>
        
        <div className="relative z-10 space-y-8">
            <div className="w-20 h-20 mx-auto bg-gradient-to-tr from-blue-600 to-indigo-600 rounded-2xl flex items-center justify-center shadow-lg transform rotate-3">
                <Download className="w-10 h-10 text-white" />
            </div>

            <div>
                <h1 className="text-2xl font-extrabold text-gray-900 tracking-tight leading-tight">
                    {linkData.title}
                </h1>
                <p className="text-gray-500 mt-2 flex items-center justify-center gap-1.5 font-medium">
                   <ShieldCheck className="w-4 h-4 text-green-500" />
                   Secure File Transfer
                </p>
            </div>

            <div className="bg-gray-50 rounded-2xl p-6 border border-gray-100">
                {!isReady ? (
                    <div className="space-y-4">
                        <div className="flex items-center justify-center gap-2 text-gray-600">
                            <Clock className="w-5 h-5 animate-pulse text-blue-500" />
                            <span className="font-medium">Generating secure link...</span>
                        </div>
                        <div className="text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600 tabular-nums">
                            {countdown}
                            <span className="text-lg font-bold text-gray-400 ml-1">sec</span>
                        </div>
                        
                        {/* Progress Bar */}
                        <div className="h-2 w-full bg-gray-200 rounded-full overflow-hidden mt-4">
                            <div 
                              className="h-full bg-gradient-to-r from-blue-500 to-indigo-500 transition-all duration-1000 ease-linear"
                              style={{ width: `${((10 - countdown) / 10) * 100}%` }}
                            ></div>
                        </div>
                    </div>
                ) : (
                    <div className="space-y-4 animate-in fade-in zoom-in duration-500">
                        <div className="text-green-600 font-semibold flex items-center justify-center gap-2">
                           <ShieldCheck className="w-5 h-5" /> Your link is ready!
                        </div>
                        <button
                            onClick={handleDownloadClick}
                            className="w-full flex items-center justify-center gap-3 py-4 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-bold rounded-xl shadow-lg shadow-blue-500/30 transition-all transform hover:scale-[1.02] active:scale-[0.98]"
                        >
                            <Download className="w-6 h-6 animate-bounce" />
                            Download Now
                        </button>
                    </div>
                )}
            </div>

            <div className="text-xs text-gray-400 font-medium pt-4">
                By downloading, you agree to our Terms of Service.
            </div>
        </div>
      </div>
    </div>
  )
}
