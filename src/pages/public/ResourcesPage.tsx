import React from 'react';
import Hero from '../../components/Hero';
import { useFirestore } from '../../lib/hooks/useFirestore';
import { Report, CaseStudy, BlogPost } from '../../types/firebase';
import { where } from 'firebase/firestore';
import { Download, ArrowRight, Calendar, Clock, Eye, Heart } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function ResourcesPage() {
  const { data: reports, loading: reportsLoading } = useFirestore<Report>({
    collection: 'reports',
    queries: [where('status', '==', 'Published')]
  });

  const { data: caseStudies, loading: caseStudiesLoading } = useFirestore<CaseStudy>({
    collection: 'case-studies',
    queries: [where('status', '==', 'Published')]
  });

  const { data: blogPosts, loading: blogLoading } = useFirestore<BlogPost>({
    collection: 'blog-posts',
    queries: [where('status', '==', 'Published')]
  });

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
        title="Resources"
        subtitle="Access tools and materials to support your leadership journey"
        image="https://images.unsplash.com/photo-1434030216411-0b793f4b4173?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80"
        height="half"
      />
      
      {/* Reports Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-[#00205b] mb-8">Research Reports</h2>
          {reportsLoading ? (
            <div className="text-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#00205b] mx-auto"></div>
            </div>
          ) : (
            <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
              {reports.map((report) => (
                <div key={report.id} className="bg-white border border-gray-200 rounded-lg overflow-hidden hover:shadow-lg transition-shadow">
                  <div className="aspect-w-16 aspect-h-9">
                    <img
                      src={report.thumbnail}
                      alt={report.title}
                      className="w-full h-48 object-cover"
                    />
                  </div>
                  <div className="p-6">
                    <h3 className="text-xl font-bold text-[#00205b] mb-2">{report.title}</h3>
                    <p className="text-gray-600 mb-4 line-clamp-2">{report.summary}</p>
                    <div className="flex items-center justify-between mb-4">
                      <span className="text-sm text-gray-500">{formatDate(report.releaseDate)}</span>
                      <span className="text-sm text-gray-500">{report.downloads} downloads</span>
                    </div>
                    <a
                      href={report.pdfUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center text-[#00205b] hover:text-[#001845]"
                    >
                      <Download className="h-4 w-4 mr-2" />
                      Download Report
                    </a>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Case Studies Section */}
      <section className="py-16 bg-[#e6e6e6]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-[#00205b] mb-8">Case Studies</h2>
          {caseStudiesLoading ? (
            <div className="text-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#00205b] mx-auto"></div>
            </div>
          ) : (
            <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
              {caseStudies.map((study) => (
                <div key={study.id} className="bg-white rounded-lg overflow-hidden hover:shadow-lg transition-shadow">
                  <div className="aspect-w-16 aspect-h-9">
                    <img
                      src={study.thumbnail}
                      alt={study.title}
                      className="w-full h-48 object-cover"
                    />
                  </div>
                  <div className="p-6">
                    <div className="flex items-center justify-between mb-4">
                      <span className="px-3 py-1 bg-[#00205b] text-white text-sm rounded-full">
                        {study.industry}
                      </span>
                      <span className="text-sm text-gray-500">{study.downloads} downloads</span>
                    </div>
                    <h3 className="text-xl font-bold text-[#00205b] mb-2">{study.title}</h3>
                    <p className="text-gray-600 mb-4 line-clamp-2">{study.challenge}</p>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-500">{formatDate(study.implementationDate)}</span>
                      <a
                        href={study.pdfUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center text-[#00205b] hover:text-[#001845]"
                      >
                        <Download className="h-4 w-4 mr-2" />
                        Download
                      </a>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Blog Posts Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-3xl font-bold text-[#00205b]">Latest Blog Posts</h2>
            <Link to="/blog" className="text-[#00205b] hover:text-[#001845] inline-flex items-center">
              View All Posts
              <ArrowRight className="h-4 w-4 ml-2" />
            </Link>
          </div>
          {blogLoading ? (
            <div className="text-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#00205b] mx-auto"></div>
            </div>
          ) : (
            <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
              {blogPosts.slice(0, 6).map((post) => (
                <div key={post.id} className="bg-white border border-gray-200 rounded-lg overflow-hidden hover:shadow-lg transition-shadow">
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
                </div>
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  );
}