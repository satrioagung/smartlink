'use client'

import { useState } from 'react'
import { Plus, Edit2, Trash2, ExternalLink, Link as LinkIcon, Activity } from 'lucide-react'
import { createLink, updateLink, deleteLink } from '@/app/actions/links'

type LinkType = {
  id: string
  title: string
  destination_url: string
  smartlink_url: string
  clicks: number
  created_at: string
}

export function LinkManager({ initialLinks }: { initialLinks: LinkType[] }) {
  const [links, setLinks] = useState<LinkType[]>(initialLinks)
  const [isEditing, setIsEditing] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [isAdding, setIsAdding] = useState(false)

  const [formData, setFormData] = useState({
    title: '',
    destination_url: '',
    smartlink_url: '',
  })

  // Handle Create
  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    try {
      const data = new FormData()
      data.append('title', formData.title)
      data.append('destination_url', formData.destination_url)
      data.append('smartlink_url', formData.smartlink_url)
      
      await createLink(data)
      // Note: In a real app we might want to refetch the optimistic data 
      // or rely on server actions revalidating the page. We will simplify by reloading for now.
      window.location.reload()
    } catch (error) {
      console.error(error)
      alert("Failed to create link")
    } finally {
      setLoading(false)
    }
  }

  // Handle Edit
  const handleUpdate = async (e: React.FormEvent, id: string) => {
    e.preventDefault()
    setLoading(true)
    try {
      const data = new FormData()
      data.append('title', formData.title)
      data.append('destination_url', formData.destination_url)
      data.append('smartlink_url', formData.smartlink_url)
      
      await updateLink(id, data)
      window.location.reload()
    } catch (error) {
      console.error(error)
      alert("Failed to update link")
    } finally {
      setLoading(false)
    }
  }

  // Handle Delete
  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this link?')) return
    
    setLoading(true)
    try {
      await deleteLink(id)
      setLinks(links.filter(link => link.id !== id))
    } catch (error) {
      console.error(error)
      alert("Failed to delete link")
    } finally {
      setLoading(false)
    }
  }

  const startEdit = (link: LinkType) => {
    setIsEditing(link.id)
    setIsAdding(false)
    setFormData({
      title: link.title,
      destination_url: link.destination_url,
      smartlink_url: link.smartlink_url,
    })
  }

  const startAdd = () => {
    setIsAdding(true)
    setIsEditing(null)
    setFormData({ title: '', destination_url: '', smartlink_url: '' })
  }

  const cancelForm = () => {
    setIsAdding(false)
    setIsEditing(null)
    setFormData({ title: '', destination_url: '', smartlink_url: '' })
  }

  return (
    <div>
      {/* Header and Add Button */}
      <div className="p-6 border-b border-gray-100 flex justify-between items-center">
        <h2 className="text-lg font-semibold text-gray-900">Your Links</h2>
        {!isAdding && !isEditing && (
          <button
            onClick={startAdd}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition"
          >
            <Plus className="w-4 h-4" /> Add New Link
          </button>
        )}
      </div>

      {/* Form (Add or Edit) */}
      {(isAdding || isEditing) && (
        <div className="p-6 bg-gray-50 border-b border-gray-100">
          <form 
            onSubmit={(e) => isEditing ? handleUpdate(e, isEditing) : handleCreate(e)}
            className="space-y-4 max-w-2xl"
          >
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
              <input
                type="text"
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
                placeholder="My Awesome File"
                value={formData.title}
                onChange={e => setFormData({...formData, title: e.target.value})}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Destination URL (e.g. Google Drive)</label>
              <input
                type="url"
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
                placeholder="https://drive.google.com/..."
                value={formData.destination_url}
                onChange={e => setFormData({...formData, destination_url: e.target.value})}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Smartlink URL (e.g. Monetag, Adsterra)</label>
              <input
                type="url"
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
                placeholder="https://www.highcpmrevenuegate.com/..."
                value={formData.smartlink_url}
                onChange={e => setFormData({...formData, smartlink_url: e.target.value})}
              />
            </div>
            
            <div className="flex gap-3 pt-2">
              <button
                type="submit"
                disabled={loading}
                className="px-4 py-2 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition"
              >
                {loading ? 'Saving...' : isEditing ? 'Update Link' : 'Create Link'}
              </button>
              <button
                type="button"
                onClick={cancelForm}
                className="px-4 py-2 bg-white border border-gray-300 text-gray-700 font-medium rounded-lg hover:bg-gray-50 transition"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Links List */}
      <div className="divide-y divide-gray-100">
        {links.length === 0 && !isAdding && (
          <div className="p-8 text-center text-gray-500">
            No links yet. Click &quot;Add New Link&quot; to get started!
          </div>
        )}
        
        {links.map((link) => (
          <div key={link.id} className="p-6 hover:bg-gray-50 transition-colors flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="space-y-2 flex-1">
              <h3 className="font-semibold text-gray-900 flex items-center gap-2">
                 <LinkIcon className="w-4 h-4 text-blue-500" /> {link.title}
              </h3>
              <div className="flex flex-col sm:flex-row gap-2 sm:gap-6 text-sm text-gray-500">
                <div className="flex items-center gap-1.5 truncate max-w-xs" title={link.destination_url}>
                  <span className="font-medium text-gray-700">Goes to:</span> 
                  <a href={link.destination_url} target="_blank" rel="noreferrer" className="hover:text-blue-600 truncate">{link.destination_url}</a>
                </div>
                <div className="flex items-center gap-1.5 truncate max-w-xs" title={link.smartlink_url}>
                  <span className="font-medium text-gray-700">AdLink:</span> 
                  <span className="truncate">{link.smartlink_url}</span>
                </div>
              </div>
            </div>
            
            <div className="flex items-center justify-between md:justify-end gap-6 md:w-64">
               {/* Click Stats */}
               <div className="flex items-center gap-2 bg-gray-100 px-3 py-1.5 rounded-full text-sm font-medium text-gray-700">
                 <Activity className="w-4 h-4" />
                 {link.clicks || 0} clicks
               </div>

               {/* Actions */}
               <div className="flex items-center gap-2">
                 <button 
                  onClick={() => window.open(`/go/${link.id}`, '_blank')}
                  className="p-2 text-gray-400 hover:text-blue-600 rounded-lg hover:bg-blue-50 transition"
                  title="Test Link"
                 >
                   <ExternalLink className="w-4 h-4" />
                 </button>
                 <button 
                  onClick={() => startEdit(link)}
                  className="p-2 text-gray-400 hover:text-orange-600 rounded-lg hover:bg-orange-50 transition"
                  title="Edit Link"
                 >
                   <Edit2 className="w-4 h-4" />
                 </button>
                 <button 
                  onClick={() => handleDelete(link.id)}
                  disabled={loading}
                  className="p-2 text-gray-400 hover:text-red-600 rounded-lg hover:bg-red-50 transition"
                  title="Delete Link"
                 >
                   <Trash2 className="w-4 h-4" />
                 </button>
               </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
