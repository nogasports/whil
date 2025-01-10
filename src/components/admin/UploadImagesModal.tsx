import React from 'react';
import Modal from '../Modal';
import { GalleryImage } from '../../types/firebase';
import { Upload, X } from 'lucide-react';
import { uploadBase64File } from '../../lib/utils/fileUpload';

interface UploadImagesModalProps {
  isOpen: boolean;
  onClose: () => void;
  albumId: string;
  onSubmit: (images: Omit<GalleryImage, 'id'>[]) => void;
}

export default function UploadImagesModal({ isOpen, onClose, albumId, onSubmit }: UploadImagesModalProps) {
  const [selectedFiles, setSelectedFiles] = React.useState<File[]>([]);
  const [captions, setCaptions] = React.useState<Record<string, string>>({});
  const [uploading, setUploading] = React.useState(false);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    setSelectedFiles(prev => [...prev, ...files]);
  };

  const removeFile = (index: number) => {
    setSelectedFiles(prev => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setUploading(true);

      const uploadPromises = selectedFiles.map(async (file) => {
        if (file.size > 1024 * 1024) {
          throw new Error(`File ${file.name} must be less than 1MB`);
        }

        const reader = new FileReader();
        const base64Data = await new Promise<string>((resolve, reject) => {
          reader.onload = () => resolve(reader.result as string);
          reader.onerror = reject;
          reader.readAsDataURL(file);
        });

        const url = await uploadBase64File(base64Data, `gallery/images/${albumId}/${Date.now()}-${file.name}`);

        return {
          albumId,
          url,
          caption: captions[file.name] || '',
          createdAt: new Date().toISOString()
        };
      });

      const uploadedImages = await Promise.all(uploadPromises);
      await onSubmit(uploadedImages);

      onClose();
      setSelectedFiles([]);
      setCaptions({});
    } catch (error) {
      alert(error instanceof Error ? error.message : 'Failed to upload images');
    } finally {
      setUploading(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Upload Images">
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Select Images
          </label>
          <div className="mt-1">
            <label className="cursor-pointer block w-full px-4 py-8 border-2 border-gray-300 border-dashed rounded-lg text-center hover:border-indigo-500">
              <Upload className="mx-auto h-12 w-12 text-gray-400" />
              <span className="mt-2 block text-sm font-medium text-gray-900">
                Click to upload images
              </span>
              <span className="mt-1 block text-xs text-gray-500">
                PNG, JPG, GIF up to 1MB
              </span>
              <input
                type="file"
                multiple
                accept="image/*"
                onChange={handleFileSelect}
                className="sr-only"
              />
            </label>
          </div>
        </div>

        {selectedFiles.length > 0 && (
          <div className="space-y-4">
            <h4 className="text-sm font-medium text-gray-900">Selected Images</h4>
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
              {selectedFiles.map((file, index) => (
                <div key={index} className="relative">
                  <div className="aspect-w-1 aspect-h-1 w-full overflow-hidden rounded-lg bg-gray-100">
                    <img
                      src={URL.createObjectURL(file)}
                      alt={file.name}
                      className="object-cover"
                    />
                    <button
                      type="button"
                      onClick={() => removeFile(index)}
                      className="absolute top-1 right-1 p-1 bg-white rounded-full shadow-sm hover:bg-gray-100"
                    >
                      <X className="h-4 w-4 text-gray-500" />
                    </button>
                  </div>
                  <input
                    type="text"
                    placeholder="Caption (optional)"
                    value={captions[file.name] || ''}
                    onChange={(e) => setCaptions(prev => ({
                      ...prev,
                      [file.name]: e.target.value
                    }))}
                    className="mt-1 block w-full text-xs rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                  />
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="mt-5 sm:mt-4 sm:flex sm:flex-row-reverse">
          <button
            type="submit"
            disabled={uploading || selectedFiles.length === 0}
            className="inline-flex w-full justify-center rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 sm:ml-3 sm:w-auto disabled:opacity-50"
          >
            {uploading ? 'Uploading...' : 'Upload Images'}
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