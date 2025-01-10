import React from 'react';
import { Users, Calendar, BookOpen, Mail, ChevronRight, Download } from 'lucide-react';
import { Link } from 'react-router-dom';
import StatsCard from '../../components/dashboard/StatsCard';
import { useFirestore } from '../../lib/hooks/useFirestore';
import { Event, Person, Report, BlogPost } from '../../types/firebase';
import { where } from 'firebase/firestore';

export default function DashboardPage() {
  const { data: events } = useFirestore<Event>({
    collection: 'events',
    queries: [where('status', '==', 'Published')]
  });

  const { data: community } = useFirestore<Person>({
    collection: 'people'
  });

  const { data: reports } = useFirestore<Report>({
    collection: 'reports',
    queries: [where('status', '==', 'Published')]
  });

  const { data: blogPosts } = useFirestore<BlogPost>({
    collection: 'blog-posts',
    queries: [where('status', '==', 'Published')]
  });

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  return (
    <div className="p-6">
      <div className="mb-8">
        <h1 className="text-2xl font-semibold text-[#06205c] mb-2">WIHL Project Dashboard</h1>
        <p className="text-gray-600">Overview of project activities and impact</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <StatsCard
          title="Community Members"
          value={community.length.toString()}
          change={{
            value: Math.round((community.length / 100) * 100),
            trend: 'up',
            text: 'total members'
          }}
          icon={<Users className="w-6 h-6 text-[#06205c]" />}
        />
        <StatsCard
          title="Active Events"
          value={events.filter(e => e.status === 'Published').length.toString()}
          change={{
            value: events.length,
            trend: 'up',
            text: 'total events'
          }}
          icon={<Calendar className="w-6 h-6 text-[#06205c]" />}
        />
        <StatsCard
          title="Published Reports"
          value={reports.length.toString()}
          change={{
            value: reports.reduce((acc, r) => acc + (r.downloads || 0), 0),
            trend: 'up',
            text: 'downloads'
          }}
          icon={<Download className="w-6 h-6 text-[#06205c]" />}
        />
        <StatsCard
          title="Blog Posts"
          value={blogPosts.length.toString()}
          change={{
            value: blogPosts.reduce((acc, p) => acc + (p.views || 0), 0),
            trend: 'up',
            text: 'total views'
          }}
          icon={<BookOpen className="w-6 h-6 text-[#06205c]" />}
        />
      </div>

      {/* Recent Events and Community Members */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        {/* Recent Events */}
        <div className="bg-white p-6 border border-gray-200 rounded-none">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-medium text-[#06205c]">Recent Events</h2>
            <Link to="/admin/events" className="text-[#06205c] hover:text-[#041843] flex items-center">
              View All <ChevronRight className="h-4 w-4 ml-1" />
            </Link>
          </div>
          <div className="space-y-4">
            {events.slice(0, 5).map(event => (
              <div key={event.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-none">
                <div>
                  <h3 className="font-medium text-[#06205c]">{event.title}</h3>
                  <div className="flex items-center mt-1 text-sm text-gray-600">
                    <Calendar className="h-4 w-4 mr-1" />
                    {formatDate(event.startDate)}
                  </div>
                </div>
                <span className={`px-2 py-1 text-xs font-medium ${
                  event.status === 'Published' ? 'bg-[#06205c] text-white' : 'bg-gray-300 text-gray-700'
                } rounded-none`}>
                  {event.status}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Community Members */}
        <div className="bg-white p-6 border border-gray-200 rounded-none">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-medium text-[#06205c]">Recent Members</h2>
            <Link to="/admin/community" className="text-[#06205c] hover:text-[#041843] flex items-center">
              View All <ChevronRight className="h-4 w-4 ml-1" />
            </Link>
          </div>
          <div className="space-y-4">
            {community.slice(0, 5).map(person => (
              <div key={person.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-none">
                <div>
                  <h3 className="font-medium text-[#06205c]">{person.name}</h3>
                  <div className="flex items-center mt-1 text-sm text-gray-600">
                    <Mail className="h-4 w-4 mr-1" />
                    {person.email}
                  </div>
                </div>
                <span className="px-2 py-1 text-xs font-medium bg-[#06205c] text-white rounded-none">
                  {person.source}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Recent Reports and Blog Posts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Reports */}
        <div className="bg-white p-6 border border-gray-200 rounded-none">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-medium text-[#06205c]">Recent Reports</h2>
            <Link to="/admin/resources" className="text-[#06205c] hover:text-[#041843] flex items-center">
              View All <ChevronRight className="h-4 w-4 ml-1" />
            </Link>
          </div>
          <div className="space-y-4">
            {reports.slice(0, 5).map(report => (
              <div key={report.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-none">
                <div>
                  <h3 className="font-medium text-[#06205c]">{report.title}</h3>
                  <div className="flex items-center mt-1 text-sm text-gray-600">
                    <Download className="h-4 w-4 mr-1" />
                    {report.downloads || 0} downloads
                  </div>
                </div>
                <span className="px-2 py-1 text-xs font-medium bg-[#06205c] text-white rounded-none">
                  {report.status}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Blog Posts */}
        <div className="bg-white p-6 border border-gray-200 rounded-none">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-medium text-[#06205c]">Recent Blog Posts</h2>
            <Link to="/admin/resources/blog" className="text-[#06205c] hover:text-[#041843] flex items-center">
              View All <ChevronRight className="h-4 w-4 ml-1" />
            </Link>
          </div>
          <div className="space-y-4">
            {blogPosts.slice(0, 5).map(post => (
              <div key={post.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-none">
                <div>
                  <h3 className="font-medium text-[#06205c]">{post.title}</h3>
                  <div className="flex items-center mt-1 text-sm text-gray-600">
                    <BookOpen className="h-4 w-4 mr-1" />
                    {post.views || 0} views
                  </div>
                </div>
                <span className="px-2 py-1 text-xs font-medium bg-[#06205c] text-white rounded-none">
                  {post.status}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}