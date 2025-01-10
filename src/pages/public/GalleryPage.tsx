import React from 'react';
import Hero from '../../components/Hero';
import { useFirestore } from '../../lib/hooks/useFirestore';
import { Album, GalleryImage } from '../../types/firebase';
import { Search, Image, ArrowLeft } from 'lucide-react';
import { getFileContent } from '../../lib/utils/fileService';
import { where } from 'firebase/firestore';

export default function GalleryPage() {
  const [searchTerm, setSearchTerm] = React.useState('');
  const [selectedAlbum, setSelectedAlbum] = React.useState<Album | null>(null);
  const [selectedImage, setSelectedImage] = React.useState<GalleryImage | null>(null);
  const [loadedImages, setLoadedImages] = React.useState<Record<string, string>>({});

  const { data: albums, loading: albumsLoading } = useFirestore<Album>({
    collection: 'albums'
  });

  const { data: images, loading: imagesLoading } = useFirestore<GalleryImage>({
    collection: 'gallery-images',
    queries: selectedAlbum ? [where('albumId', '==', selectedAlbum.id)] : []
  });

  const filteredAlbums = React.useMemo(() => {
    return albums.filter(album =>
      album.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      album.description.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [albums, searchTerm]);

  React.useEffect(() => {
    // Load images from Firestore when needed
    const loadImages = async () => {
      const newLoadedImages: Record<string, string> = {};
      
      // Load album cover images
      for (const album of albums) {
        if (album.coverImage?.startsWith('firestore://') && !loadedImages[album.coverImage]) {
          try {
            newLoadedImages[album.coverImage] = await getFileContent(album.coverImage);
          } catch (error) {
            console.error('Error loading album cover:', error);
          }
        }
      }
      
      // Load gallery images
      for (const image of images) {
        if (image.url.startsWith('firestore://') && !loadedImages[image.url]) {
          try {
            newLoadedImages[image.url] = await getFileContent(image.url);
          } catch (error) {
            console.error('Error loading gallery image:', error);
          }
        }
      }
      
      setLoadedImages(prev => ({ ...prev, ...newLoadedImages }));
    };

    loadImages();
  }, [albums, images]);

  const getImageUrl = (url: string) => {
    return url.startsWith('firestore://') ? loadedImages[url] || '' : url;
  };

  return (
    <div>
      <Hero
        title="Gallery"
        subtitle="Visual highlights from our events and programs"
        image="https://images.unsplash.com/photo-1582213782179-e0d53f98f2ca?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80"
        height="half"
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Back button when viewing album */}
        {selectedAlbum && (
          <button
            onClick={() => {
              setSelectedAlbum(null);
              setSelectedImage(null);
            }}
            className="mb-6 inline-flex items-center text-gray-600 hover:text-gray-900"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Albums
          </button>
        )}

        {/* Search bar */}
        <div className="mb-8">
          <div className="relative">
            <Search className="h-5 w-5 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder={selectedAlbum ? "Search images..." : "Search albums..."}
              className="pl-10 w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
            />
          </div>
        </div>

        {/* Image Lightbox */}
        {selectedImage && (
          <div className="fixed inset-0 z-50 bg-black bg-opacity-90 flex items-center justify-center p-4">
            <button
              onClick={() => setSelectedImage(null)}
              className="absolute top-4 right-4 text-white hover:text-gray-300"
            >
              <X className="h-6 w-6" />
            </button>
            <img
              src={getImageUrl(selectedImage.url)}
              alt={selectedImage.caption || ''}
              className="max-h-[90vh] max-w-[90vw] object-contain"
            />
            {selectedImage.caption && (
              <div className="absolute bottom-4 left-0 right-0 text-center text-white">
                <p className="text-lg">{selectedImage.caption}</p>
              </div>
            )}
          </div>
        )}

        {/* Albums Grid */}
        {!selectedAlbum && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {albumsLoading ? (
              <div className="col-span-full text-center py-12">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto"></div>
              </div>
            ) : filteredAlbums.length === 0 ? (
              <div className="col-span-full text-center py-12">
                <Image className="mx-auto h-12 w-12 text-gray-400" />
                <h3 className="mt-2 text-sm font-medium text-gray-900">No albums found</h3>
              </div>
            ) : (
              filteredAlbums.map((album) => (
                <div
                  key={album.id}
                  onClick={() => setSelectedAlbum(album)}
                  className="cursor-pointer group"
                >
                  <div className="aspect-w-3 aspect-h-2 rounded-lg overflow-hidden bg-gray-100">
                    {album.coverImage ? (
                      <img
                        src={getImageUrl(album.coverImage)}
                        alt={album.name}
                        className="object-cover group-hover:opacity-75 transition-opacity"
                      />
                    ) : (
                      <div className="flex items-center justify-center">
                        <Image className="h-12 w-12 text-gray-400" />
                      </div>
                    )}
                  </div>
                  <h3 className="mt-4 text-lg font-medium text-gray-900">{album.name}</h3>
                  <p className="mt-1 text-sm text-gray-500">{album.description}</p>
                </div>
              ))
            )}
          </div>
        )}

        {/* Images Grid */}
        {selectedAlbum && (
          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-6">{selectedAlbum.name}</h2>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {imagesLoading ? (
                <div className="col-span-full text-center py-12">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto"></div>
                </div>
              ) : images.length === 0 ? (
                <div className="col-span-full text-center py-12">
                  <Image className="mx-auto h-12 w-12 text-gray-400" />
                  <h3 className="mt-2 text-sm font-medium text-gray-900">No images in this album</h3>
                </div>
              ) : (
                images.map((image) => (
                  <div
                    key={image.id}
                    onClick={() => setSelectedImage(image)}
                    className="cursor-pointer group"
                  >
                    <div className="aspect-w-1 aspect-h-1 rounded-lg overflow-hidden bg-gray-100">
                      <img
                        src={getImageUrl(image.url)}
                        alt={image.caption || ''}
                        className="object-cover group-hover:opacity-75 transition-opacity"
                      />
                    </div>
                    {image.caption && (
                      <p className="mt-2 text-sm text-gray-500">{image.caption}</p>
                    )}
                  </div>
                ))
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}