import { useState } from 'react';
import { ArrowRight, ChevronRight, Users, BookOpen, LineChart, Target, Calendar, Download } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useFirestore } from '../../lib/hooks/useFirestore';
import { Event, Report } from '../../types/firebase';
import { where, orderBy, limit } from 'firebase/firestore';
import Header from '../../components/common/Header';

const objectives = [
  {
    icon: Users,
    title: 'Leadership Development',
    description: 'Empowering women to take on leadership roles in healthcare organizations.'
  },
  {
    icon: BookOpen,
    title: 'Research Excellence',
    description: 'Conducting rigorous research to understand barriers and enablers.'
  },
  {
    icon: LineChart,
    title: 'Evidence-Based Change',
    description: 'Implementing data-driven interventions for organizational transformation.'
  },
  {
    icon: Target,
    title: 'Sustainable Impact',
    description: 'Creating lasting change in healthcare leadership diversity.'
  }
];

const workstreams = [
  {
    number: '01',
    title: 'Consortium Leadership',
    description: 'Strathmore University Business School leads this collaborative effort to drive change across the health sector.'
  },
  {
    number: '02',
    title: 'Organizational Change',
    description: 'Using data-driven insights, we design interventions to foster women\'s advancement in leadership.'
  },
  {
    number: '03',
    title: 'Advocacy',
    description: 'Together with the Kenya Healthcare Federation, we champion evidence-based policies to transform workplaces.'
  }
];

export default function HomePage() {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const { data: upcomingEvents = [] } = useFirestore<Event>({
    collection: 'events',
    queries: [
      where('status', '==', 'Published'),
      where('startDate', '>=', new Date().toISOString()),
      orderBy('startDate', 'asc'),
      limit(3)
    ]
  });

  const { data: latestReports = [] } = useFirestore<Report>({
    collection: 'reports',
    queries: [
      where('status', '==', 'Published'),
      orderBy('releaseDate', 'desc'),
      limit(3)
    ]
  });

  return (
    <>
      <Header />
      <div className="bg-white">
        {/* Hero Section */}
        <div className="relative min-h-[80vh]">
          <div className="absolute inset-0">
            <img
              src="https://images.unsplash.com/photo-1582750433449-648ed127bb54"
              alt="Women in Healthcare"
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-[#06205c]/90 mix-blend-multiply" />
            <div className="absolute bottom-[70px] left-[70px] w-[calc(100%-140px)] h-[3px] bg-[#a9343a]"></div>
            <div className="absolute bottom-[70px] left-[70px] w-[3px] h-[calc(100%-140px)] bg-[#a9343a]"></div>
          </div>
          <div className="relative max-w-7xl mx-auto py-24 px-4 sm:py-32 sm:px-6 lg:px-8 flex flex-col justify-center h-full">
            <h1 className="text-5xl font-extrabold tracking-tight text-white sm:text-6xl lg:text-7xl">
              Women in Health Leadership (WHIL)
            </h1>
            <p className="mt-8 text-2xl text-neutral-light max-w-4xl">
              A groundbreaking initiative empowering mid-to-senior level women leaders to reshape the future of healthcare across Kenya, Nigeria, and India. Through evidence-based research, strategic interventions, and collaborative partnerships, we're creating pathways for sustainable leadership transformation in the health sector.
            </p>
            <div className="mt-10 relative group">
              <button 
                className="group inline-flex items-center px-8 py-4 text-xl font-medium text-[#06205c] bg-white hover:bg-neutral-light transition-all duration-300"
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              >
                Get Involved
                <ChevronRight className="ml-2 h-6 w-6 group-hover:translate-x-1 transition-transform" />
              </button>
              
              {isDropdownOpen && (
                <div className="absolute mt-2 w-48 bg-white rounded-md shadow-lg z-10">
                  <Link 
                    to="/about"
                    className="block px-4 py-3 text-lg text-[#06205c] hover:bg-neutral-light"
                  >
                    Learn More
                  </Link>
                  <Link 
                    to="/resources"
                    className="block px-4 py-3 text-lg text-[#06205c] hover:bg-neutral-light"
                  >
                    Access Resources
                  </Link>
                  <Link 
                    to="/events"
                    className="block px-4 py-3 text-lg text-[#06205c] hover:bg-neutral-light"
                  >
                    Attend Event
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Quick Stats Section */}
        <div className="bg-[#06205c] text-white py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
              <div>
                <div className="text-4xl font-bold">10,443</div>
                <div className="text-neutral-light mt-2">Total Data Points</div>
              </div>
              <div>
                <div className="text-4xl font-bold">403</div>
                <div className="text-neutral-light mt-2">Organizations</div>
              </div>
              <div>
                <div className="text-4xl font-bold">3,015</div>
                <div className="text-neutral-light mt-2">Surveys Conducted</div>
              </div>
              <div>
                <div className="text-4xl font-bold">38</div>
                <div className="text-neutral-light mt-2">Key Informant Interviews</div>
              </div>
            </div>
          </div>
        </div>

        {/* Objectives Section */}
        <div className="bg-gray-50 py-24">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center">
              <h2 className="text-3xl font-extrabold text-[#06205c] sm:text-4xl">
                Our Objectives
              </h2>
              <p className="mt-3 max-w-2xl mx-auto text-lg text-gray-500">
                Our mission is to enable women leaders in the health sector to rise and thrive.
              </p>
            </div>
            <div className="mt-12 grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
              {objectives.map((objective) => {
                const Icon = objective.icon;
                return (
                  <div
                    key={objective.title}
                    className="relative bg-white p-8 shadow-lg hover:shadow-xl transition-all"
                  >
                    <div className="w-12 h-12 bg-[#06205c]/10 rounded-lg flex items-center justify-center mb-6">
                      <Icon className="h-6 w-6 text-[#06205c]" />
                    </div>
                    <h3 className="text-xl font-bold text-[#06205c] mb-4">
                      {objective.title}
                    </h3>
                    <p className="text-gray-600">
                      {objective.description}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Workstreams Section */}
        <div className="py-24 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center">
              <h2 className="text-3xl font-extrabold text-[#06205c] sm:text-4xl">
                Our Workstreams
              </h2>
              <p className="mt-3 max-w-2xl mx-auto text-lg text-gray-500">
                A collaborative approach to driving organizational change.
              </p>
            </div>
            <div className="mt-12 grid gap-8 sm:grid-cols-3">
              {workstreams.map((workstream) => (
                <div
                  key={workstream.number}
                  className="bg-gray-50 p-8 shadow-lg hover:shadow-xl transition-all"
                >
                  <div className="text-2xl font-bold text-[#06205c] mb-4">
                    {workstream.number}
                  </div>
                  <h3 className="text-xl font-bold text-[#06205c] mb-4">
                    {workstream.title}
                  </h3>
                  <p className="text-gray-600">
                    {workstream.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Upcoming Events Section */}
        <div className="py-24 bg-gray-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center mb-12">
              <div>
                <h2 className="text-3xl font-bold text-[#06205c]">Upcoming Events</h2>
                <p className="mt-2 text-xl text-gray-600">Join our transformative programs</p>
              </div>
              <Link 
                to="/events"
                className="text-[#06205c] hover:text-[#06205c]/80 flex items-center"
              >
                View All Events
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </div>
            
            <div className="grid gap-8 md:grid-cols-3">
              {upcomingEvents.map((event) => (
                <div key={event.id} className="bg-white shadow-lg overflow-hidden">
                  {event.poster && (
                    <img 
                      src={event.poster} 
                      alt={event.title}
                      className="w-full h-48 object-cover"
                    />
                  )}
                  <div className="p-6">
                    <span className="inline-block px-3 py-1 text-sm font-medium text-[#06205c] bg-[#06205c]/10">
                      {event.type}
                    </span>
                    <h3 className="mt-4 text-xl font-semibold text-[#06205c]">{event.title}</h3>
                    <p className="mt-2 text-gray-600 line-clamp-2">{event.description}</p>
                    <div className="mt-4 flex items-center text-sm text-gray-500">
                      <Calendar className="h-4 w-4 mr-2" />
                      {new Date(event.startDate).toLocaleDateString()}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Latest Reports Section */}
        <div className="py-24 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center mb-12">
              <div>
                <h2 className="text-3xl font-bold text-[#06205c]">Latest Reports</h2>
                <p className="mt-2 text-xl text-gray-600">Evidence-based insights and recommendations</p>
              </div>
              <Link 
                to="/resources"
                className="text-[#06205c] hover:text-[#06205c]/80 flex items-center"
              >
                View All Reports
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </div>
            
            <div className="grid gap-8 md:grid-cols-3">
              {latestReports.map((report) => (
                <div key={report.id} className="bg-white shadow-lg overflow-hidden">
                  <img 
                    src={report.thumbnail} 
                    alt={report.title}
                    className="w-full h-48 object-cover"
                  />
                  <div className="p-6">
                    <h3 className="text-xl font-semibold text-[#06205c] mb-2">{report.title}</h3>
                    <p className="text-gray-600 line-clamp-2">{report.summary}</p>
                    <div className="mt-4 flex items-center justify-between">
                      <span className="text-sm text-gray-500">
                        {new Date(report.releaseDate).toLocaleDateString()}
                      </span>
                      <a 
                        href={report.pdfUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center text-[#06205c] hover:text-[#06205c]/80"
                      >
                        <Download className="h-4 w-4 mr-2" />
                        Download
                      </a>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* CTA Section */}
        <div className="py-24 bg-[#06205c]">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center">
              <h2 className="text-3xl font-bold text-white sm:text-4xl">
                Join the Movement
              </h2>
              <p className="mt-4 text-xl text-neutral-light max-w-2xl mx-auto">
                Together, we can create workplaces where women leaders thrive and transform healthcare delivery.
              </p>
              <div className="mt-8 flex justify-center gap-4">
                <Link
                  to="/events"
                  className="inline-flex items-center px-6 py-3 text-lg font-medium text-[#06205c] bg-white hover:bg-neutral-light transition-all duration-300"
                >
                  Attend an Event
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
                <Link
                  to="/resources"
                  className="inline-flex items-center px-6 py-3 text-lg font-medium text-white border-2 border-white hover:bg-white hover:text-[#06205c] transition-all duration-300"
                >
                  Access Resources
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}