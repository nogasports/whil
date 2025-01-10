import React from 'react';
import { Plus, Search, Image, Edit, Trash2, Star, Clock, Eye, Heart } from 'lucide-react';
import { useFirestore } from '../../lib/hooks/useFirestore';
import { BlogPost } from '../../types/firebase';
import AddBlogPostModal from './AddBlogPostModal';

export default function BlogList() {
  const [isAddModalOpen, setIsAddModalOpen] = React.useState(false);
  const [searchTerm, setSearchTerm] = React.useState('');
  const [selectedCategory, setSelectedCategory] = React.useState('All Categories');
  const [selectedStatus, setSelectedStatus] = React.useState('All Status');

  const { data: posts, loading, error, add, remove, update } = useFirestore<BlogPost>({
    collection: 'blog-posts'
  });

  const categories = React.useMemo(() => {
    const allCategories = posts.flatMap(post => post.categories);
    return Array.from(new Set(allCategories));
  }, [posts]);

  const filteredPosts = React.useMemo(() => {
    return posts.filter(post => {
      const matchesSearch = 
        post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        post.author.name.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesCategory = selectedCategory === 'All Categories' || post.categories.includes(selectedCategory);
      const matchesStatus = selectedStatus === 'All Status' || post.status === selectedStatus;
      return matchesSearch && matchesCategory && matchesStatus;
    });
  }, [posts, searchTerm, selectedCategory, selectedStatus]);

  const toggleFeatured = async (post: BlogPost) => {
    if (post.id) {
      await update(post.id, { featured: !post.featured });
    }
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold text-gray-900">Blog Posts</h2>
        <button
          onClick={() => setIsAddModalOpen(true)}
          className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700"
        >
          <Plus className="h-4 w-4 mr-2" />
          Write New Post
        </button>
      </div>

      <AddBlogPostModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onSubmit={add}
      />

      <div className="bg-white rounded-lg shadow-sm">
        <div className="p-6 border-b border-gray-200">
          <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4">
            <div className="flex-1 relative">
              <Search className="h-5 w-5 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search blog posts..."
                className="pl-10 w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
              />
            </div>
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
            >
              <option>All Categories</option>
              {categories.map(category => (
                <option key={category}>{category}</option>
              ))}
            </select>
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
            >
              <option>All Status</option>
              <option>Draft</option>
              <option>Published</option>
              <option>Archived</option>
            </select>
          </div>
        </div>

        <div className="divide-y divide-gray-200">
          {loading ? (
            <div className="p-6 text-center text-gray-500">Loading blog posts...</div>
          ) : error ? (
            <div className="p-6 text-center text-red-500">
              Error loading blog posts: {error.message}
            </div>
          ) : filteredPosts.length === 0 ? (
            <div className="p-6 text-center text-gray-500">No blog posts found</div>
          ) : (
            filteredPosts.map((post) => (
              <div key={post.id} className="p-6 hover:bg-gray-50">
                <div className="flex items-start space-x-4">
                  {post.coverImage ? (
                    <img
                      src={post.coverImage}
                      alt={post.title}
                      className="h-32 w-48 object-cover rounded-lg"
                    />
                  ) : (
                    <div className="h-32 w-48 bg-indigo-100 rounded-lg flex items-center justify-center">
                      <Image className="h-8 w-8 text-indigo-600" />
                    </div>
                  )}
                  <div className="flex-1">
                    <div className="flex items-start justify-between">
                      <div>
                        <h3 className="text-lg font-medium text-gray-900">
                          {post.title}
                        </h3>
                        <div className="mt-1 flex items-center space-x-4">
                          <div className="flex items-center">
                            <img
                              src={post.author.avatar}
                              alt={post.author.name}
                              className="h-6 w-6 rounded-full mr-2"
                            />
                            <span className="text-sm text-gray-600">
                              {post.author.name}
                            </span>
                          </div>
                          <span className="text-sm text-gray-500">
                            {new Date(post.publishDate).toLocaleDateString()}
                          </span>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <button
                          onClick={() => toggleFeatured(post)}
                          className={`p-1 ${
                            post.featured ? 'text-yellow-500' : 'text-gray-400'
                          } hover:text-yellow-600`}
                          title={post.featured ? 'Remove from featured' : 'Add to featured'}
                        >
                          <Star className="h-5 w-5" />
                        </button>
                        <button
                          className="p-1 text-gray-400 hover:text-gray-600"
                          title="Edit"
                        >
                          <Edit className="h-5 w-5" />
                        </button>
                        <button
                          onClick={() => {
                            if (post.id && confirm('Are you sure you want to delete this post?')) {
                              remove(post.id);
                            }
                          }}
                          className="p-1 text-gray-400 hover:text-red-600"
                          title="Delete"
                        >
                          <Trash2 className="h-5 w-5" />
                        </button>
                      </div>
                    </div>
                    <p className="mt-2 text-sm text-gray-500 line-clamp-2">
                      {post.excerpt}
                    </p>
                    <div className="mt-3 flex items-center space-x-6">
                      <div className="flex items-center text-sm text-gray-500">
                        <Clock className="h-4 w-4 mr-1" />
                        {post.readTime} min read
                      </div>
                      <div className="flex items-center text-sm text-gray-500">
                        <Eye className="h-4 w-4 mr-1" />
                        {post.views} views
                      </div>
                      <div className="flex items-center text-sm text-gray-500">
                        <Heart className="h-4 w-4 mr-1" />
                        {post.likes} likes
                      </div>
                    </div>
                    <div className="mt-3 flex flex-wrap gap-2">
                      {post.categories.map((category) => (
                        <span
                          key={category}
                          className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800"
                        >
                          {category}
                        </span>
                      ))}
                      {post.tags.map((tag) => (
                        <span
                          key={tag}
                          className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}