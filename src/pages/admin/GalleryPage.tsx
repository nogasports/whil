import React, { useState } from 'react';
import { Plus, Search, Image, Trash2, Upload, FolderPlus, ChevronRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useFirestore } from '../../lib/hooks/useFirestore';
import { Album, GalleryImage } from '../../types/firebase';
import AddAlbumModal from '../../components/admin/AddAlbumModal';
import UploadImagesModal from '../../components/admin/UploadImagesModal';
import { where } from 'firebase/firestore';

export default function GalleryPage() {
  const [isAddAlbumModalOpen, setIsAddAlbumModalOpen] = useState(false);
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const [selectedAlbumId, setSelectedAlbumId] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [lightboxImage, setLightboxImage] = useState<string | null>(null);

  const { data: albums, loading: albumsLoading, add: addAlbum, remove: removeAlbum } = useFirestore<Album>({
    collection: 'albums'
  });

  const { data: images, loading: imagesLoading, add: addImage, remove: removeImage } = useFirestore<GalleryImage>({
    collection: 'gallery-images',
    queries: selectedAlbumId ? [where('albumId', '==', selectedAlbumId)] : []
  });

  const filteredAlbums = React.useMemo(() => {
    return albums.filter(album =>
      album.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      album.description.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [albums, searchTerm]);

  const handleAddImages = async (newImages: Omit<GalleryImage, 'id'>[]) => {
    try {
      await Promise.all(newImages.map(image => addImage(image)));
    } catch (error) {
      console.error('Error adding images:', error);
    }
  };

  return (
    <div className="bg-white">
      {/* Breadcrumbs */}
      <div className="flex items-center text-sm text-gray-500 mb-6 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <Link to="/" className="hover:text-[#06205c]">Home</Link>
        <ChevronRight className="h-4 w-4 mx-2" />
        <span>Gallery</span>
        {selectedAlbumId && (
          <>
            <ChevronRight className="h-4 w-4 mx-2" />
            <span>{albums.find(album => album.id === selectedAlbumId)?.name}</span>
          </>
        )}
      </div>

      {/* Header */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-3xl font-bold text-[#06205c]">Gallery</h2>
          <div className="flex space-x-4">
            <button
              onClick={() => setIsAddAlbumModalOpen(true)}
              className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-[#06205c] hover:bg-[#06205c]/90"
            >
              <FolderPlus className="h-4 w-4 mr-2" />
              New Album
            </button>
            {selectedAlbumId && (
              <button
                onClick={() => setIsUploadModalOpen(true)}
                className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-[#06205c] hover:bg-[#06205c]/90"
              >
                <Upload className="h-4 w-4 mr-2" />
                Upload Images
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Modals */}
      <AddAlbumModal
        isOpen={isAddAlbumModalOpen}
        onClose={() => setIsAddAlbumModalOpen(false)}
        onSubmit={addAlbum}
      />

      {selectedAlbumId && (
        <UploadImagesModal
          isOpen={isUploadModalOpen}
          onClose={() => setIsUploadModalOpen(false)}
          albumId={selectedAlbumId}
          onSubmit={handleAddImages}
        />
      )}

      {/* Search Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-6">
        <div className="bg-white rounded-lg shadow-sm">
          <div className="p-6 border-b border-gray-200">
            <div className="flex items-center space-x-4">
              <div className="flex-1 relative">
                <Search className="h-5 w-5 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Search albums..."
                  className="pl-10 w-full border-gray-300 rounded-md shadow-sm focus:ring-[#06205c] focus:border-[#06205c]"
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Albums Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {albumsLoading ? (
            <div className="col-span-full text-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#06205c] mx-auto"></div>
            </div>
          ) : filteredAlbums.length === 0 ? (
            <div className="col-span-full text-center py-12">
              <Image className="mx-auto h-12 w-12 text-gray-400" />
              <h3 className="mt-2 text-sm font-medium text-gray-900">No albums</h3>
              <p className="mt-1 text-sm text-gray-500">Get started by creating a new album.</p>
              <div className="mt-6">
                <button
                  onClick={() => setIsAddAlbumModalOpen(true)}
                  className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-[#06205c] hover:bg-[#06205c]/90"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  New Album
                </button>
              </div>
            </div>
          ) : (
            filteredAlbums.map((album) => (
              <div
                key={album.id}
                className={`relative group cursor-pointer rounded-lg overflow-hidden ${
                  selectedAlbumId === album.id ? 'ring-2 ring-[#06205c]' : ''
                }`}
                onClick={() => setSelectedAlbumId(album.id || null)}
              >
                <div className="aspect-w-1 aspect-h-1 bg-gray-200">
                  {album.coverImage ? (
                    <img
                      src={album.coverImage}
                      alt={album.name}
                      className="object-cover"
                    />
                  ) : (
                    <div className="flex items-center justify-center">
                      <Image className="h-12 w-12 text-gray-400" />
                    </div>
                  )}
                  <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-50 transition-opacity" />
                  <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        if (album.id && confirm('Are you sure you want to delete this album?')) {
                          removeAlbum(album.id);
                        }
                      }}
                      className="p-2 bg-white rounded-full text-red-600 hover:text-red-700"
                    >
                      <Trash2 className="h-5 w-5" />
                    </button>
                  </div>
                </div>
                <div className="p-4">
                  <h3 className="text-sm font-medium text-gray-900">{album.name}</h3>
                  <p className="mt-1 text-sm text-gray-500 line-clamp-2">{album.description}</p>
                  <p className="mt-2 text-sm text-gray-500">{images.filter(img => img.albumId === album.id).length} images</p>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Images Grid */}
      {selectedAlbumId && (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-12">
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {imagesLoading ? (
              <div className="col-span-full text-center py-12">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#06205c] mx-auto"></div>
              </div>
            ) : images.length === 0 ? (
              <div className="col-span-full text-center py-12">
                <Image className="mx-auto h-12 w-12 text-gray-400" />
                <h3 className="mt-2 text-sm font-medium text-gray-900">No images</h3>
                <p className="mt-1 text-sm text-gray-500">Upload images to this album.</p>
                <div className="mt-6">
                  <button
                    onClick={() => setIsUploadModalOpen(true)}
                    className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-[#06205c] hover:bg-[#06205c]/90"
                  >
                    <Upload className="h-4 w-4 mr-2" />
                    Upload Images
                  </button>
                </div>
              </div>
            ) : (
              images.map((image, index) => (
                <div key={image.id} className="relative group">
                  <div className="aspect-w-1 aspect-h-1 rounded-lg overflow-hidden bg-gray-100">
                    <img
                      src={image.url}
                      alt={image.caption || ''}
                      className="object-cover cursor-pointer"
                      onClick={() => setLightboxImage(image.url)}
                    />
                    <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-50 transition-opacity" />
                    <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                      <button
                        onClick={() => image.id && removeImage(image.id)}
                        className="p-2 bg-white rounded-full text-red-600 hover:text-red-700"
                      >
                        <Trash2 className="h-5 w-5" />
                      </button>
                    </div>
                  </div>
                  {image.caption && (
                    <div className="mt-2">
                      <p className="text-sm text-gray-500">{image.caption}</p>
                    </div>
                  )}
                </div>
              ))
            )}
          </div>
        </div>
      )}

      {/* Lightbox */}
      {lightboxImage && (
        <div
          className="fixed inset-0 bg-black bg-opacity-90 flex items-center justify-center z-50"
          onClick={() => setLightboxImage(null)}
        >
          <img
            src={lightboxImage}
            alt="Lightbox"
            className="max-w-full max-h-full"
          />
        </div>
      )}
    </div>
  );
}