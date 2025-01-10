import React from 'react';
import Hero from '../../components/Hero';
import { useFirestore } from '../../lib/hooks/useFirestore';
import { BlogPost } from '../../types/firebase';
import { where } from 'firebase/firestore';
import { Calendar, Clock, Eye, Heart, Search } from 'lucide-react';

export default function BlogPage() {
  const [searchTerm, setSearchTerm] = React.useState('');
  const [selectedCategory, setSelectedCategory] = React.useState('All Categories');

  const { data: posts, loading } = useFirestore<BlogPost>({
    collection: 'blog-posts',
    queries: [where('status', '==', 'Published')]
  });

  const categories = React.useMemo(() => {
    const allCategories = posts.flatMap(post => post.categories);
    return ['All Categories', ...Array.from(new Set(allCategories))];
  }, [posts]);

  const filteredPosts = React.useMemo(() => {
    return posts.filter(post => {
      const matchesSearch = 
        post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        post.excerpt.toLowerCase().includes(searchTerm.toLowerCase()) ||
        post.author.name.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesCategory = selectedCategory === 'All Categories' || post.categories.includes(selectedCategory);
      return matchesSearch && matchesCategory;
    });
  }, [posts, searchTerm, selectedCategory]);

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString('en-US', {
      month: 'long',
      day: 'numeric',
      year: 'numeric'
    });
  };

  return (
    <div>
      <Hero
        title="WIHL Blog"
        subtitle="Insights and perspectives on women's leadership in healthcare"
        image="https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d?ixlib=rb-4.0.3&auto=format&fit=crop&w=2072&q=80"
        height="half"
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Filters */}
        <div className="mb-12">
          <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4">
            <div className="flex-1 relative">
              <Search className="h-5 w-5 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search blog posts..."
                className="pl-10 w-full border-gray-300 rounded-md shadow-sm focus:ring-[#00205b] focus:border-[#00205b]"
              />
            </div>
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="w-full sm:w-48 border-gray-300 rounded-md shadow-sm focus:ring-[#00205b] focus:border-[#00205b]"
            >
              {categories.map(category => (
                <option key={category}>{category}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Blog Posts Grid */}
        {loading ? (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#00205b] mx-auto"></div>
          </div>
        ) : filteredPosts.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-500">No blog posts found</p>
          </div>
        ) : (
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {filteredPosts.map((post) => (
              <article
                key={post.id}
                className="bg-white border border-gray-200 rounded-lg overflow-hidden hover:shadow-lg transition-shadow"
              >
                <div className="aspect-w-16 aspect-h-9">
                  <img
                    src={post.coverImage}
                    alt={post.title}
                    className="w-full h-48 object-cover"
                  />
                </div>
                <div className="p-6">
                  <div className="flex items-center space-x-4 mb-4">
                    <img
                      src={post.author.avatar}
                      alt={post.author.name}
                      className="h-10 w-10 rounded-full"
                    />
                    <div>
                      <h4 className="text-sm font-medium text-gray-900">{post.author.name}</h4>
                      <p className="text-sm text-gray-500">{post.author.role}</p>
                    </div>
                  </div>
                  <div className="mb-4">
                    {post.categories.map(category => (
                      <span
                        key={category}
                        className="inline-block bg-[#e6e6e6] text-[#00205b] px-3 py-1 rounded-full text-sm font-medium mr-2 mb-2"
                      >
                        {category}
                      </span>
                    ))}
                  </div>
                  <h3 className="text-xl font-bold text-[#00205b] mb-2">{post.title}</h3>
                  <p className="text-gray-600 mb-4 line-clamp-2">{post.excerpt}</p>
                  <div className="flex items-center justify-between text-sm text-gray-500">
                    <div className="flex items-center space-x-4">
                      <span className="flex items-center">
                        <Calendar className="h-4 w-4 mr-1" />
                        {formatDate(post.publishDate)}
                      </span>
                      <span className="flex items-center">
                        <Clock className="h-4 w-4 mr-1" />
                        {post.readTime} min read
                      </span>
                    </div>
                    <div className="flex items-center space-x-4">
                      <span className="flex items-center">
                        <Eye className="h-4 w-4 mr-1" />
                        {post.views}
                      </span>
                      <span className="flex items-center">
                        <Heart className="h-4 w-4 mr-1" />
                        {post.likes}
                      </span>
                    </div>
                  </div>
                </div>
              </article>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}