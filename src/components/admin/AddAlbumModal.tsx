import React from 'react';
import Modal from '../Modal';
import { Album } from '../../types/firebase';
import { Upload } from 'lucide-react';
import { uploadBase64File } from '../../lib/utils/fileUpload';

interface AddAlbumModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (album: Omit<Album, 'id'>) => void;
}

export default function AddAlbumModal({ isOpen, onClose, onSubmit }: AddAlbumModalProps) {
  const [formData, setFormData] = React.useState<Omit<Album, 'id'>>({
    name: '',
    description: '',
    coverImage: '',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  });

  const [coverFile, setCoverFile] = React.useState<File | null>(null);
  const [uploading, setUploading] = React.useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setUploading(true);

      let coverImageUrl = formData.coverImage;
      if (coverFile) {
        if (coverFile.size > 1024 * 1024) {
          throw new Error('Cover image must be less than 1MB');
        }

        const reader = new FileReader();
        const base64Data = await new Promise<string>((resolve, reject) => {
          reader.onload = () => resolve(reader.result as string);
          reader.onerror = reject;
          reader.readAsDataURL(coverFile);
        });
        coverImageUrl = await uploadBase64File(base64Data, `gallery/albums/${Date.now()}-${coverFile.name}`);
      }

      await onSubmit({
        ...formData,
        coverImage: coverImageUrl
      });

      onClose();
      setFormData({
        name: '',
        description: '',
        coverImage: '',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      });
      setCoverFile(null);
    } catch (error) {
      alert(error instanceof Error ? error.message : 'Failed to create album');
    } finally {
      setUploading(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Create New Album">
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label htmlFor="name" className="block text-sm font-medium text-gray-700">
            Album Name
          </label>
          <input
            type="text"
            id="name"
            required
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
          />
        </div>

        <div>
          <label htmlFor="description" className="block text-sm font-medium text-gray-700">
            Description
          </label>
          <textarea
            id="description"
            rows={3}
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">
            Cover Image
          </label>
          <div className="mt-1 flex items-center space-x-4">
            {formData.coverImage && (
              <img
                src={formData.coverImage}
                alt="Album cover"
                className="h-20 w-20 object-cover rounded"
              />
            )}
            <label className="cursor-pointer bg-white py-2 px-3 border border-gray-300 rounded-md shadow-sm text-sm leading-4 font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
              <span className="flex items-center">
                <Upload className="h-4 w-4 mr-2" />
                Upload Cover
              </span>
              <input
                type="file"
                className="sr-only"
                accept="image/*"
                onChange={(e) => setCoverFile(e.target.files?.[0] || null)}
              />
            </label>
            {coverFile && (
              <span className="text-sm text-gray-500">
                {coverFile.name}
              </span>
            )}
          </div>
        </div>

        <div className="mt-5 sm:mt-4 sm:flex sm:flex-row-reverse">
          <button
            type="submit"
            disabled={uploading}
            className="inline-flex w-full justify-center rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 sm:ml-3 sm:w-auto"
          >
            {uploading ? 'Creating...' : 'Create Album'}
          </button>
          <button
            type="button"
            onClick={onClose}
            disabled={uploading}
            className="mt-3 inline-flex w-full justify-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 sm:mt-0 sm:w-auto"
          >
            Cancel
          </button>
        </div>
      </form>
    </Modal>
  );
}