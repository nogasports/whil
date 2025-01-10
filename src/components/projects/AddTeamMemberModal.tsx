import React from 'react';
import Modal from '../Modal';
import { Upload } from 'lucide-react';
import { TeamMember, Partner } from '../../types/firebase';

interface AddTeamMemberModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (member: Omit<TeamMember, 'id'>) => void;
  partners: Partner[];
}

export default function AddTeamMemberModal({
  isOpen,
  onClose,
  onSubmit,
  partners
}: AddTeamMemberModalProps) {
  const [formData, setFormData] = React.useState<Omit<TeamMember, 'id'>>({
    name: '',
    role: '',
    partnerId: '',
    linkedIn: '',
    bio: '',
    avatar: ''
  });
  const [avatarFile, setAvatarFile] = React.useState<File | null>(null);
  const [uploading, setUploading] = React.useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setUploading(true);
      
      let avatarUrl = '';
      if (avatarFile) {
        const reader = new FileReader();
        avatarUrl = await new Promise((resolve, reject) => {
          reader.onload = () => resolve(reader.result as string);
          reader.onerror = reject;
          reader.readAsDataURL(avatarFile);
        });
      }

      const memberData = {
        ...formData,
        avatar: avatarUrl || formData.avatar
      };

      await onSubmit(memberData);
      onClose();
      setFormData({
        name: '',
        role: '',
        partnerId: '',
        linkedIn: '',
        bio: '',
        avatar: ''
      });
      setAvatarFile(null);
    } catch (error) {
      console.error('Error adding team member:', error);
    } finally {
      setUploading(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Add Team Member">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="name" className="block text-sm font-medium text-gray-700">
            Full Name
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
          <label htmlFor="role" className="block text-sm font-medium text-gray-700">
            Role
          </label>
          <input
            type="text"
            id="role"
            required
            value={formData.role}
            onChange={(e) => setFormData({ ...formData, role: e.target.value })}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
          />
        </div>

        <div>
          <label htmlFor="partnerId" className="block text-sm font-medium text-gray-700">
            Partner Organization
          </label>
          <select
            id="partnerId"
            required
            value={formData.partnerId}
            onChange={(e) => setFormData({ ...formData, partnerId: e.target.value })}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
          >
            <option value="">Select Partner</option>
            {partners.map((partner) => (
              <option key={partner.id} value={partner.id}>
                {partner.name}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label htmlFor="linkedIn" className="block text-sm font-medium text-gray-700">
            LinkedIn Profile URL
          </label>
          <input
            type="url"
            id="linkedIn"
            required
            value={formData.linkedIn}
            onChange={(e) => setFormData({ ...formData, linkedIn: e.target.value })}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">
            Profile Photo
          </label>
          <div className="mt-1 flex items-center space-x-4">
            <label className="relative cursor-pointer bg-white rounded-md font-medium text-indigo-600 hover:text-indigo-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-indigo-500">
              <div className="flex items-center space-x-2 px-3 py-2 border border-gray-300 rounded-md">
                <Upload className="h-5 w-5" />
                <span>Upload Photo</span>
              </div>
              <input
                type="file"
                className="sr-only"
                accept="image/*"
                onChange={(e) => setAvatarFile(e.target.files?.[0] || null)}
              />
            </label>
            {avatarFile && (
              <span className="text-sm text-gray-500">
                {avatarFile.name}
              </span>
            )}
          </div>
        </div>

        <div>
          <label htmlFor="bio" className="block text-sm font-medium text-gray-700">
            Bio
          </label>
          <textarea
            id="bio"
            rows={3}
            required
            value={formData.bio}
            onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
            placeholder="Enter a brief bio..."
          />
        </div>

        <div className="mt-5 sm:mt-4 sm:flex sm:flex-row-reverse">
          <button
            type="submit"
            disabled={uploading}
            className="inline-flex w-full justify-center rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 sm:ml-3 sm:w-auto"
          >
            {uploading ? 'Adding...' : 'Add Team Member'}
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