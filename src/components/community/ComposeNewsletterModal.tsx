import React from 'react';
import Modal from '../Modal';
import { Newsletter } from '../../types/firebase';
import NewsletterEditor from './NewsletterEditor';
import Button from '../Button';

interface ComposeNewsletterModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (newsletter: Omit<Newsletter, 'id'>) => void;
}

export default function ComposeNewsletterModal({ isOpen, onClose, onSubmit }: ComposeNewsletterModalProps) {
  const [formData, setFormData] = React.useState<Omit<Newsletter, 'id'>>({
    subject: '',
    content: '',
    preview: '',
    sentAt: '',
    recipients: 0,
    openRate: 0,
    status: 'Draft'
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await onSubmit(formData);
      onClose();
      setFormData({
        subject: '',
        content: '',
        preview: '',
        sentAt: '',
        recipients: 0,
        openRate: 0,
        status: 'Draft'
      });
    } catch (error) {
      console.error('Error creating newsletter:', error);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Compose Newsletter">
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label htmlFor="subject" className="block text-sm font-medium text-gray-700">
            Subject Line
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
          <label htmlFor="preview" className="block text-sm font-medium text-gray-700">
            Preview Text
          </label>
          <input
            type="text"
            id="preview"
            required
            value={formData.preview}
            onChange={(e) => setFormData({ ...formData, preview: e.target.value })}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Content
          </label>
          <NewsletterEditor
            content={formData.content}
            onChange={(content) => setFormData({ ...formData, content })}
          />
        </div>

        <div className="mt-5 sm:mt-4 sm:flex sm:flex-row-reverse">
          <Button
            type="submit"
            className="sm:ml-3"
          >
            Save Draft
          </Button>
          <Button
            type="button"
            variant="outline"
            onClick={onClose}
            className="mt-3 sm:mt-0"
          >
            Cancel
          </Button>
        </div>
      </form>
    </Modal>
  );
}