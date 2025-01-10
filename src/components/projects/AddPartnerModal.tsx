import React from 'react';
import Modal from '../Modal';
import { Upload } from 'lucide-react';
import { Partner } from '../../types/firebase';
import { db } from '../../lib/firebase';
import { doc, setDoc } from 'firebase/firestore';

interface AddPartnerModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (partner: Omit<Partner, 'id'>) => void;
}

export default function AddPartnerModal({ isOpen, onClose, onSubmit }: AddPartnerModalProps) {
  const [formData, setFormData] = React.useState<Omit<Partner, 'id'>>({
    name: '',
    type: 'Grantor',
    status: 'Active',
    website: '',
    logo: '',
    description: ''
  });
  const [logoFile, setLogoFile] = React.useState<File | null>(null);
  const [uploading, setUploading] = React.useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setUploading(true);
      
      // Convert logo file to base64 for Firestore storage
      let logoUrl = '';
      if (logoFile) {
        const reader = new FileReader();
        logoUrl = await new Promise((resolve, reject) => {
          reader.onload = () => resolve(reader.result as string);
          reader.onerror = reject;
          reader.readAsDataURL(logoFile);
        });
      }

      const partnerData = {
        ...formData,
        logo: logoUrl || formData.logo
      };

      await onSubmit(partnerData);
      onClose();
      setFormData({
        name: '',
        type: 'Grantor',
        status: 'Active',
        website: '',
        logo: '',
        description: ''
      });
      setLogoFile(null);
    } catch (error) {
      console.error('Error adding partner:', error);
    } finally {
      setUploading(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Add New Partner">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="name" className="block text-sm font-medium text-gray-700">
            Partner Name
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
          <label htmlFor="type" className="block text-sm font-medium text-gray-700">
            Type
          </label>
          <select
            id="type"
            value={formData.type}
            onChange={(e) => setFormData({ ...formData, type: e.target.value as Partner['type'] })}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
          >
            <option value="Grantor">Grantor</option>
            <option value="Grantee">Grantee</option>
            <option value="Sub Grantee">Sub Grantee</option>
          </select>
        </div>

        <div>
          <label htmlFor="status" className="block text-sm font-medium text-gray-700">
            Status
          </label>
          <select
            id="status"
            value={formData.status}
            onChange={(e) => setFormData({ ...formData, status: e.target.value as Partner['status'] })}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
          >
            <option value="Active">Active</option>
            <option value="Inactive">Inactive</option>
          </select>
        </div>

        <div>
          <label htmlFor="website" className="block text-sm font-medium text-gray-700">
            Website URL
          </label>
          <input
            type="url"
            id="website"
            required
            value={formData.website}
            onChange={(e) => setFormData({ ...formData, website: e.target.value })}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">
            Logo
          </label>
          <div className="mt-1 flex items-center space-x-4">
            <label className="relative cursor-pointer bg-white rounded-md font-medium text-indigo-600 hover:text-indigo-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-indigo-500">
              <div className="flex items-center space-x-2 px-3 py-2 border border-gray-300 rounded-md">
                <Upload className="h-5 w-5" />
                <span>Upload Logo</span>
              </div>
              <input
                type="file"
                className="sr-only"
                accept="image/*"
                onChange={(e) => setLogoFile(e.target.files?.[0] || null)}
              />
            </label>
            {logoFile && (
              <span className="text-sm text-gray-500">
                {logoFile.name}
              </span>
            )}
          </div>
        </div>

        <div>
          <label htmlFor="description" className="block text-sm font-medium text-gray-700">
            Partner Description
          </label>
          <textarea
            id="description"
            rows={3}
            required
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
            placeholder="Enter a description of the partnership..."
          />
        </div>

        <div className="mt-5 sm:mt-4 sm:flex sm:flex-row-reverse">
          <button
            type="submit"
            disabled={uploading}
            className="inline-flex w-full justify-center rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 sm:ml-3 sm:w-auto"
          >
            {uploading ? 'Adding...' : 'Add Partner'}
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