import React from 'react';
import Modal from '../Modal';
import { Report } from '../../types/firebase';
import { Upload, Plus, X } from 'lucide-react';
import { uploadBase64File, getFileContent } from '../../lib/utils/fileUpload';

interface AddReportModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (report: Omit<Report, 'id'>) => void;
}

export default function AddReportModal({ isOpen, onClose, onSubmit }: AddReportModalProps) {
  const [formData, setFormData] = React.useState<Omit<Report, 'id'>>({
    title: '',
    authors: [{ name: '', role: '', organization: '' }],
    thumbnail: '',
    subject: '',
    summary: '',
    releaseDate: '',
    pdfUrl: '',
    tags: [],
    status: 'Draft',
    downloads: 0
  });

  const [newTag, setNewTag] = React.useState('');
  const [pdfFile, setPdfFile] = React.useState<File | null>(null);
  const [thumbnailFile, setThumbnailFile] = React.useState<File | null>(null);
  const [uploading, setUploading] = React.useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      // Validate file sizes
      if (pdfFile && pdfFile.size > 1024 * 1024) {
        throw new Error('PDF file must be less than 1MB');
      }
      if (thumbnailFile && thumbnailFile.size > 1024 * 1024) {
        throw new Error('Thumbnail image must be less than 1MB');
      }

      setUploading(true);
      
      // Upload PDF if selected
      let pdfUrl = formData.pdfUrl;
      if (pdfFile) {
        const reader = new FileReader();
        const base64Data = await new Promise<string>((resolve, reject) => {
          reader.onload = () => resolve(reader.result as string);
          reader.onerror = reject;
          reader.readAsDataURL(pdfFile);
        });
        pdfUrl = await uploadBase64File(base64Data, `reports/pdfs/${Date.now()}-${pdfFile.name}`);
      }

      // Upload thumbnail if selected
      let thumbnailUrl = formData.thumbnail;
      if (thumbnailFile) {
        const reader = new FileReader();
        const base64Data = await new Promise<string>((resolve, reject) => {
          reader.onload = () => resolve(reader.result as string);
          reader.onerror = reject;
          reader.readAsDataURL(thumbnailFile);
        });
        thumbnailUrl = await uploadBase64File(base64Data, `reports/thumbnails/${Date.now()}-${thumbnailFile.name}`);
      }

      await onSubmit({
        ...formData,
        pdfUrl,
        thumbnail: thumbnailUrl
      });

      onClose();
      setFormData({
        title: '',
        authors: [{ name: '', role: '', organization: '' }],
        thumbnail: '',
        subject: '',
        summary: '',
        releaseDate: '',
        pdfUrl: '',
        tags: [],
        status: 'Draft',
        downloads: 0
      });
    } catch (error) {
      alert(error instanceof Error ? error.message : 'Failed to create report');
    } finally {
      setUploading(false);
    }
  };

  const addAuthor = () => {
    setFormData({
      ...formData,
      authors: [...formData.authors, { name: '', role: '', organization: '' }]
    });
  };

  const removeAuthor = (index: number) => {
    const newAuthors = [...formData.authors];
    newAuthors.splice(index, 1);
    setFormData({ ...formData, authors: newAuthors });
  };

  const updateAuthor = (index: number, field: keyof typeof formData.authors[0], value: string) => {
    const newAuthors = [...formData.authors];
    newAuthors[index] = { ...newAuthors[index], [field]: value };
    setFormData({ ...formData, authors: newAuthors });
  };

  const addTag = () => {
    if (newTag.trim() && !formData.tags.includes(newTag.trim())) {
      setFormData({
        ...formData,
        tags: [...formData.tags, newTag.trim()]
      });
      setNewTag('');
    }
  };

  const removeTag = (tag: string) => {
    setFormData({
      ...formData,
      tags: formData.tags.filter(t => t !== tag)
    });
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Add New Report">
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label htmlFor="title" className="block text-sm font-medium text-gray-700">
            Report Title
          </label>
          <input
            type="text"
            id="title"
            required
            value={formData.title}
            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Authors
          </label>
          <div className="space-y-4">
            {formData.authors.map((author, index) => (
              <div key={index} className="p-4 bg-gray-50 rounded-lg space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-500">Author {index + 1}</span>
                  {formData.authors.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeAuthor(index)}
                      className="text-red-600 hover:text-red-800"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  )}
                </div>
                <input
                  type="text"
                  placeholder="Name"
                  required
                  value={author.name}
                  onChange={(e) => updateAuthor(index, 'name', e.target.value)}
                  className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                />
                <input
                  type="text"
                  placeholder="Role"
                  required
                  value={author.role}
                  onChange={(e) => updateAuthor(index, 'role', e.target.value)}
                  className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                />
                <input
                  type="text"
                  placeholder="Organization"
                  required
                  value={author.organization}
                  onChange={(e) => updateAuthor(index, 'organization', e.target.value)}
                  className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                />
              </div>
            ))}
            <button
              type="button"
              onClick={addAuthor}
              className="inline-flex items-center text-sm text-indigo-600 hover:text-indigo-900"
            >
              <Plus className="h-4 w-4 mr-1" />
              Add Author
            </button>
          </div>
        </div>

        <div>
          <label htmlFor="subject" className="block text-sm font-medium text-gray-700">
            Subject
          </label>
          <input
            type="text"
            id="subject"
            required
            value={formData.subject}
            onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
          />
        </div>

        <div>
          <label htmlFor="summary" className="block text-sm font-medium text-gray-700">
            Summary
          </label>
          <textarea
            id="summary"
            rows={4}
            required
            value={formData.summary}
            onChange={(e) => setFormData({ ...formData, summary: e.target.value })}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
          />
        </div>

        <div>
          <label htmlFor="releaseDate" className="block text-sm font-medium text-gray-700">
            Release Date
          </label>
          <input
            type="date"
            id="releaseDate"
            required
            value={formData.releaseDate}
            onChange={(e) => setFormData({ ...formData, releaseDate: e.target.value })}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">
            Thumbnail
          </label>
          <div className="mt-1 flex items-center space-x-4">
            {formData.thumbnail && (
              <img
                src={formData.thumbnail}
                alt="Report thumbnail"
                className="h-20 w-20 object-cover rounded"
              />
            )}
            <label className="cursor-pointer bg-white py-2 px-3 border border-gray-300 rounded-md shadow-sm text-sm leading-4 font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
              <span className="flex items-center">
                <Upload className="h-4 w-4 mr-2" />
                Upload Thumbnail
              </span>
              <input
                type="file"
                className="sr-only"
                accept="image/*"
                onChange={(e) => setThumbnailFile(e.target.files?.[0] || null)}
              />
            </label>
            {thumbnailFile && (
              <span className="text-sm text-gray-500">
                {thumbnailFile.name}
              </span>
            )}
          </div>
        </div>

        <div>
          <label htmlFor="pdfUrl" className="block text-sm font-medium text-gray-700">
            PDF URL
          </label>
          <div className="mt-1 flex items-center space-x-4">
            <label className="cursor-pointer bg-white py-2 px-3 border border-gray-300 rounded-md shadow-sm text-sm leading-4 font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
              <span className="flex items-center">
                <Upload className="h-4 w-4 mr-2" />
                Upload PDF
              </span>
              <input
                type="file"
                className="sr-only"
                accept=".pdf"
                onChange={(e) => setPdfFile(e.target.files?.[0] || null)}
                required={!formData.pdfUrl}
              />
            </label>
            {pdfFile && (
              <span className="text-sm text-gray-500">
                {pdfFile.name}
              </span>
            )}
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Tags
          </label>
          <div className="flex flex-wrap gap-2 mb-2">
            {formData.tags.map((tag) => (
              <span
                key={tag}
                className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-indigo-100 text-indigo-800"
              >
                {tag}
                <button
                  type="button"
                  onClick={() => removeTag(tag)}
                  className="ml-1 text-indigo-600 hover:text-indigo-900"
                >
                  <X className="h-3 w-3" />
                </button>
              </span>
            ))}
          </div>
          <div className="flex items-center space-x-2">
            <input
              type="text"
              value={newTag}
              onChange={(e) => setNewTag(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addTag())}
              placeholder="Add a tag"
              className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
            />
            <button
              type="button"
              onClick={addTag}
              className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-indigo-700 bg-indigo-100 hover:bg-indigo-200"
            >
              Add
            </button>
          </div>
        </div>

        <div>
          <label htmlFor="status" className="block text-sm font-medium text-gray-700">
            Status
          </label>
          <select
            id="status"
            value={formData.status}
            onChange={(e) => setFormData({ ...formData, status: e.target.value as Report['status'] })}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
          >
            <option value="Draft">Draft</option>
            <option value="Published">Published</option>
            <option value="Archived">Archived</option>
          </select>
        </div>

        <div className="mt-5 sm:mt-4 sm:flex sm:flex-row-reverse">
          <button
            type="submit"
            disabled={uploading}
            className="inline-flex w-full justify-center rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 sm:ml-3 sm:w-auto"
          >
            {uploading ? 'Uploading...' : 'Create Report'}
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