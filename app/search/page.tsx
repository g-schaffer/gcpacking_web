'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'

interface Photo {
  id: string
  created_at: string
  photo_url: string
  number_command: string
}

export default function SearchPage() {
  const [searchQuery, setSearchQuery] = useState('')
  const [photos, setPhotos] = useState<Photo[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!searchQuery.trim()) {
      setError('Veuillez entrer un numéro de commande')
      return
    }

    setLoading(true)
    setError(null)
    setPhotos([])

    try {
      const supabase = createClient()
      const { data, error: fetchError } = await supabase
        .from('photos')
        .select('*')
        .eq('number_command', searchQuery.trim())
        .order('created_at', { ascending: false })

      if (fetchError) {
        throw fetchError
      }

      if (data && data.length > 0) {
        setPhotos(data)
      } else {
        setError('Aucune photo trouvée pour ce numéro de commande')
      }
    } catch (err) {
      console.error('Erreur de recherche:', err)
      setError('Erreur lors de la recherche des photos')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen py-6 md:py-12" style={{ backgroundColor: '#F0EBE5' }}>
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row items-center justify-center mb-8 gap-4 md:gap-6">
          <img
            src="/logo.jpg"
            alt="Logo"
            className="h-24 md:h-24 w-auto"
          />
          <h1 className="text-lg md:text-3xl font-bold text-center md:text-left" style={{ color: '#1D436A' }}>
            Recherche de photos par numéro de commande
          </h1>
        </div>
        
        <form onSubmit={handleSearch} className="mb-8 max-w-2xl mx-auto">
          <div className="flex flex-col sm:flex-row gap-2 sm:gap-2">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Entrez le numéro de commande..."
              className="flex-1 rounded-lg border border-gray-300 px-4 py-3 text-gray-900 placeholder-gray-500 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <button
              type="submit"
              disabled={loading}
              className="rounded-lg px-6 py-3 font-semibold text-white focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 whitespace-nowrap"
              style={{ backgroundColor: '#ECB61E', borderColor: '#ECB61E' }}
              onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#D4A01C'}
              onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#ECB61E'}
            >
              {loading ? 'Recherche...' : 'Rechercher'}
            </button>
          </div>
        </form>

        {error && (
          <div className="mb-6 rounded-lg bg-red-50 p-4">
            <p className="text-sm text-red-800">{error}</p>
          </div>
        )}

        {photos.length > 0 && (
          <div>
            <p className="mb-4 text-lg font-semibold text-gray-700">
              {photos.length} photo{photos.length > 1 ? 's' : ''} trouvée{photos.length > 1 ? 's' : ''} pour la commande &ldquo;{searchQuery}&rdquo;
            </p>
            
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
              {photos.map((photo) => (
                <div key={photo.id} className="group relative overflow-hidden rounded-lg bg-white shadow-md transition-shadow hover:shadow-lg">
                  <div className="aspect-square relative">
                    <img
                      src={photo.photo_url}
                      alt={`Photo de la commande ${photo.number_command}`}
                      className="h-full w-full object-cover"
                      onError={(e) => {
                        const target = e.target as HTMLImageElement
                        target.src = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="400" height="400" viewBox="0 0 400 400"%3E%3Crect width="400" height="400" fill="%23f3f4f6"/%3E%3Ctext x="50%25" y="50%25" font-family="Arial" font-size="20" fill="%239ca3af" text-anchor="middle" dy=".3em"%3EImage non disponible%3C/text%3E%3C/svg%3E'
                      }}
                    />
                  </div>
                  <div className="p-3">
                    <p className="text-xs text-gray-500">
                      {new Date(photo.created_at).toLocaleDateString('fr-FR', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {!loading && photos.length === 0 && !error && searchQuery && (
          <div className="text-center text-gray-500">
            <p>Entrez un numéro de commande et cliquez sur Rechercher</p>
          </div>
        )}
      </div>
    </div>
  )
}