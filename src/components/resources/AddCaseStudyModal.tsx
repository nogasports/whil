import React from 'react';
import Modal from '../Modal';
import { CaseStudy } from '../../types/firebase';
import { Upload, Plus, X } from 'lucide-react';
import { uploadBase64File } from '../../lib/utils/fileUpload';

interface AddCaseStudyModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (caseStudy: Omit<CaseStudy, 'id'>) => void;
}

export default function AddCaseStudyModal({ isOpen, onClose, onSubmit }: AddCaseStudyModalProps) {
  const [formData, setFormData] = React.useState<Omit<CaseStudy, 'id'>>({
    title: '',
    organization: '',
    industry: '',
    challenge: '',
    solution: '',
    results: '',
    implementationDate: '',
    contactPerson: {
      name: '',
      role: '',
      email: ''
    },
    thumbnail: '',
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
      setUploading(true);
      
      let pdfUrl = formData.pdfUrl;
      if (pdfFile) {
        const reader = new FileReader();
        const base64Data = await new Promise<string>((resolve, reject) => {
          reader.onload = () => resolve(reader.result as string);
          reader.onerror = reject;
          reader.readAsDataURL(pdfFile);
        });
        pdfUrl = await uploadBase64File(base64Data, `case-studies/${Date.now()}-${pdfFile.name}`);
      }

      let thumbnailUrl = formData.thumbnail;
      if (thumbnailFile) {
        const reader = new FileReader();
        const base64Data = await new Promise<string>((resolve, reject) => {
          reader.onload = () => resolve(reader.result as string);
          reader.onerror = reject;
          reader.readAsDataURL(thumbnailFile);
        });
        thumbnailUrl = await uploadBase64File(base64Data, `thumbnails/${Date.now()}-${thumbnailFile.name}`);
      }

      await onSubmit({
        ...formData,
        pdfUrl,
        thumbnail: thumbnailUrl
      });

      onClose();
      setFormData({
        title: '',
        organization: '',
        industry: '',
        challenge: '',
        solution: '',
        results: '',
        implementationDate: '',
        contactPerson: {
          name: '',
          role: '',
          email: ''
        },
        thumbnail: '',
        pdfUrl: '',
        tags: [],
        status: 'Draft',
        downloads: 0
      });
    } catch (error) {
      console.error('Error adding case study:', error);
    } finally {
      setUploading(false);
    }
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
    <Modal isOpen={isOpen} onClose={onClose} title="Add New Case Study">
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label htmlFor="title" className="block text-sm font-medium text-gray-700">
            Case Study Title
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

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
          <div>
            <label htmlFor="organization" className="block text-sm font-medium text-gray-700">
              Organization
            </label>
            <input
              type="text"
              id="organization"
              required
              value={formData.organization}
              onChange={(e) => setFormData({ ...formData, organization: e.target.value })}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
            />
          </div>

          <div>
            <label htmlFor="industry" className="block text-sm font-medium text-gray-700">
              Industry
            </label>
            <input
              type="text"
              id="industry"
              required
              value={formData.industry}
              onChange={(e) => setFormData({ ...formData, industry: e.target.value })}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
            />
          </div>
        </div>

        <div>
          <label htmlFor="challenge" className="block text-sm font-medium text-gray-700">
            Challenge
          </label>
          <textarea
            id="challenge"
            rows={3}
            required
            value={formData.challenge}
            onChange={(e) => setFormData({ ...formData, challenge: e.target.value })}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
            placeholder="Describe the challenge or problem faced..."
          />
        </div>

        <div>
          <label htmlFor="solution" className="block text-sm font-medium text-gray-700">
            Solution
          </label>
          <textarea
            id="solution"
            rows={3}
            required
            value={formData.solution}
            onChange={(e) => setFormData({ ...formData, solution: e.target.value })}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
            placeholder="Describe the implemented solution..."
          />
        </div>

        <div>
          <label htmlFor="results" className="block text-sm font-medium text-gray-700">
            Results
          </label>
          <textarea
            id="results"
            rows={3}
            required
            value={formData.results}
            onChange={(e) => setFormData({ ...formData, results: e.target.value })}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
            placeholder="Describe the outcomes and results..."
          />
        </div>

        <div>
          <label htmlFor="implementationDate" className="block text-sm font-medium text-gray-700">
            Implementation Date
          </label>
          <input
            type="date"
            id="implementationDate"
            required
            value={formData.implementationDate}
            onChange={(e) => setFormData({ ...formData, implementationDate: e.target.value })}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
          />
        </div>

        <div className="bg-gray-50 rounded-lg p-4">
          <h4 className="text-sm font-medium text-gray-900 mb-4">Contact Person</h4>
          <div className="space-y-4">
            <div>
              <label htmlFor="contactName" className="block text-sm font-medium text-gray-700">
                Name
              </label>
              <input
                type="text"
                id="contactName"
                required
                value={formData.contactPerson.name}
                onChange={(e) => setFormData({
                  ...formData,
                  contactPerson: { ...formData.contactPerson, name: e.target.value }
                })}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
              />
            </div>
            <div>
              <label htmlFor="contactRole" className="block text-sm font-medium text-gray-700">
                Role
              </label>
              <input
                type="text"
                id="contactRole"
                required
                value={formData.contactPerson.role}
                onChange={(e) => setFormData({
                  ...formData,
                  contactPerson: { ...formData.contactPerson, role: e.target.value }
                })}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
              />
            </div>
            <div>
              <label htmlFor="contactEmail" className="block text-sm font-medium text-gray-700">
                Email
              </label>
              <input
                type="email"
                id="contactEmail"
                required
                value={formData.contactPerson.email}
                onChange={(e) => setFormData({
                  ...formData,
                  contactPerson: { ...formData.contactPerson, email: e.target.value }
                })}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
              />
            </div>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">
            Thumbnail
          </label>
          <div className="mt-1 flex items-center space-x-4">
            {formData.thumbnail && (
              <img
                src={formData.thumbnail}
                alt="Case study thumbnail"
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
          <label className="block text-sm font-medium text-gray-700">
            PDF Document
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
            onChange={(e) => setFormData({ ...formData, status: e.target.value as CaseStudy['status'] })}
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
            {uploading ? 'Uploading...' : 'Create Case Study'}
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