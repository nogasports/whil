import React from 'react';
import Modal from '../Modal';
import { BlogPost } from '../../types/firebase';
import { Upload, Plus, X } from 'lucide-react';
import { uploadBase64File } from '../../lib/utils/fileUpload';

interface AddBlogPostModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (post: Omit<BlogPost, 'id'>) => void;
}

export default function AddBlogPostModal({ isOpen, onClose, onSubmit }: AddBlogPostModalProps) {
  const [formData, setFormData] = React.useState<Omit<BlogPost, 'id'>>({
    title: '',
    slug: '',
    content: '',
    excerpt: '',
    coverImage: '',
    author: {
      name: '',
      role: '',
      avatar: ''
    },
    categories: [],
    tags: [],
    publishDate: new Date().toISOString().split('T')[0],
    status: 'Draft',
    featured: false,
    readTime: 0,
    views: 0,
    likes: 0
  });

  const [newCategory, setNewCategory] = React.useState('');
  const [newTag, setNewTag] = React.useState('');
  const [coverImageFile, setCoverImageFile] = React.useState<File | null>(null);
  const [avatarFile, setAvatarFile] = React.useState<File | null>(null);
  const [uploading, setUploading] = React.useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setUploading(true);
      
      // Upload cover image if selected
      let coverImageUrl = formData.coverImage;
      if (coverImageFile) {
        const reader = new FileReader();
        const base64Data = await new Promise<string>((resolve, reject) => {
          reader.onload = () => resolve(reader.result as string);
          reader.onerror = reject;
          reader.readAsDataURL(coverImageFile);
        });
        coverImageUrl = await uploadBase64File(base64Data, `blog/${Date.now()}-${coverImageFile.name}`);
      }

      // Upload avatar if selected
      let avatarUrl = formData.author.avatar;
      if (avatarFile) {
        const reader = new FileReader();
        const base64Data = await new Promise<string>((resolve, reject) => {
          reader.onload = () => resolve(reader.result as string);
          reader.onerror = reject;
          reader.readAsDataURL(avatarFile);
        });
        avatarUrl = await uploadBase64File(base64Data, `avatars/${Date.now()}-${avatarFile.name}`);
      }

      // Calculate read time based on content length (rough estimate)
      const wordCount = formData.content.trim().split(/\s+/).length;
      const readTime = Math.ceil(wordCount / 200); // Assuming average reading speed of 200 words per minute

      await onSubmit({
        ...formData,
        coverImage: coverImageUrl,
        author: {
          ...formData.author,
          avatar: avatarUrl
        },
        readTime,
        slug: formData.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')
      });

      onClose();
      setFormData({
        title: '',
        slug: '',
        content: '',
        excerpt: '',
        coverImage: '',
        author: {
          name: '',
          role: '',
          avatar: ''
        },
        categories: [],
        tags: [],
        publishDate: new Date().toISOString().split('T')[0],
        status: 'Draft',
        featured: false,
        readTime: 0,
        views: 0,
        likes: 0
      });
    } catch (error) {
      console.error('Error adding blog post:', error);
    } finally {
      setUploading(false);
    }
  };

  const addCategory = () => {
    if (newCategory.trim() && !formData.categories.includes(newCategory.trim())) {
      setFormData({
        ...formData,
        categories: [...formData.categories, newCategory.trim()]
      });
      setNewCategory('');
    }
  };

  const removeCategory = (category: string) => {
    setFormData({
      ...formData,
      categories: formData.categories.filter(c => c !== category)
    });
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
    <Modal isOpen={isOpen} onClose={onClose} title="Write New Blog Post">
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label htmlFor="title" className="block text-sm font-medium text-gray-700">
            Post Title
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
          <label htmlFor="excerpt" className="block text-sm font-medium text-gray-700">
            Excerpt
          </label>
          <textarea
            id="excerpt"
            rows={2}
            required
            value={formData.excerpt}
            onChange={(e) => setFormData({ ...formData, excerpt: e.target.value })}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
            placeholder="Brief summary of the post..."
          />
        </div>

        <div>
          <label htmlFor="content" className="block text-sm font-medium text-gray-700">
            Content
          </label>
          <textarea
            id="content"
            rows={10}
            required
            value={formData.content}
            onChange={(e) => setFormData({ ...formData, content: e.target.value })}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
            placeholder="Write your blog post content here..."
          />
        </div>

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
          <div>
            <label htmlFor="authorName" className="block text-sm font-medium text-gray-700">
              Author Name
            </label>
            <input
              type="text"
              id="authorName"
              required
              value={formData.author.name}
              onChange={(e) => setFormData({
                ...formData,
                author: { ...formData.author, name: e.target.value }
              })}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
            />
          </div>

          <div>
            <label htmlFor="authorRole" className="block text-sm font-medium text-gray-700">
              Author Role
            </label>
            <input
              type="text"
              id="authorRole"
              required
              value={formData.author.role}
              onChange={(e) => setFormData({
                ...formData,
                author: { ...formData.author, role: e.target.value }
              })}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">
            Author Avatar
          </label>
          <div className="mt-1 flex items-center space-x-4">
            {formData.author.avatar && (
              <img
                src={formData.author.avatar}
                alt="Author avatar"
                className="h-12 w-12 rounded-full object-cover"
              />
            )}
            <label className="cursor-pointer bg-white py-2 px-3 border border-gray-300 rounded-md shadow-sm text-sm leading-4 font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
              <span className="flex items-center">
                <Upload className="h-4 w-4 mr-2" />
                Upload Avatar
              </span>
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
          <label className="block text-sm font-medium text-gray-700">
            Cover Image
          </label>
          <div className="mt-1 flex items-center space-x-4">
            {formData.coverImage && (
              <img
                src={formData.coverImage}
                alt="Cover"
                className="h-32 w-48 object-cover rounded-lg"
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
                onChange={(e) => setCoverImageFile(e.target.files?.[0] || null)}
              />
            </label>
            {coverImageFile && (
              <span className="text-sm text-gray-500">
                {coverImageFile.name}
              </span>
            )}
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Categories
          </label>
          <div className="flex flex-wrap gap-2 mb-2">
            {formData.categories.map((category) => (
              <span
                key={category}
                className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800"
              >
                {category}
                <button
                  type="button"
                  onClick={() => removeCategory(category)}
                  className="ml-1 text-blue-600 hover:text-blue-900"
                >
                  <X className="h-3 w-3" />
                </button>
              </span>
            ))}
          </div>
          <div className="flex items-center space-x-2">
            <input
              type="text"
              value={newCategory}
              onChange={(e) => setNewCategory(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addCategory())}
              placeholder="Add a category"
              className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
            />
            <button
              type="button"
              onClick={addCategory}
              className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-blue-700 bg-blue-100 hover:bg-blue-200"
            >
              Add
            </button>
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
                className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800"
              >
                {tag}
                <button
                  type="button"
                  onClick={() => removeTag(tag)}
                  className="ml-1 text-gray-600 hover:text-gray-900"
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
              className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-gray-700 bg-gray-100 hover:bg-gray-200"
            >
              Add
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
          <div>
            <label htmlFor="publishDate" className="block text-sm font-medium text-gray-700">
              Publish Date
            </label>
            <input
              type="date"
              id="publishDate"
              required
              value={formData.publishDate}
              onChange={(e) => setFormData({ ...formData, publishDate: e.target.value })}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
            />
          </div>

          <div>
            <label htmlFor="status" className="block text-sm font-medium text-gray-700">
              Status
            </label>
            <select
              id="status"
              value={formData.status}
              onChange={(e) => setFormData({ ...formData, status: e.target.value as BlogPost['status'] })}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
            >
              <option value="Draft">Draft</option>
              <option value="Published">Published</option>
              <option value="Archived">Archived</option>
            </select>
          </div>
        </div>

        <div className="flex items-center">
          <input
            type="checkbox"
            id="featured"
            checked={formData.featured}
            onChange={(e) => setFormData({ ...formData, featured: e.target.checked })}
            className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
          />
          <label htmlFor="featured" className="ml-2 block text-sm text-gray-700">
            Feature this post
          </label>
        </div>

        <div className="mt-5 sm:mt-4 sm:flex sm:flex-row-reverse">
          <button
            type="submit"
            disabled={uploading}
            className="inline-flex w-full justify-center rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 sm:ml-3 sm:w-auto"
          >
            {uploading ? 'Creating...' : 'Create Post'}
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