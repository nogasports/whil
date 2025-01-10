import { 
  Users, 
  Building2, 
  ArrowRight, 
  LineChart, 
  Target,
  Search,
  Globe,
  BookOpen,
  ClipboardList,
  TrendingUp
} from 'lucide-react';
import Hero from '../../components/Hero';

const impactMetrics = [
  {
    number: '150+',
    label: 'Healthcare Organizations',
    description: 'Leading institutions across three countries'
  },
  {
    number: '3,000+',
    label: 'Women Leaders',
    description: 'Engaged in leadership development'
  },
  {
    number: '40+',
    label: 'Research Publications',
    description: 'Evidence-based insights'
  }
];

const countryData = [
  {
    name: 'Kenya',
    organizations: '150+',
    leaders: '1000+'
  },
  {
    name: 'Nigeria',
    organizations: '100+',
    leaders: '800+'
  },
  {
    name: 'India',
    organizations: '150+',
    leaders: '1200+'
  }
];

const studyPhases = [
  {
    phase: "Discovery",
    icon: Search,
    methods: [
      {
        title: "Employee Surveys",
        count: "3,015 responses",
        description: "Comprehensive data collection across healthcare organizations"
      },
      {
        title: "Key Informant Interviews",
        count: "38 leaders",
        description: "In-depth conversations with healthcare executives"
      },
      {
        title: "Focus Groups",
        count: "12 sessions",
        description: "Collaborative discussions with diverse stakeholders"
      }
    ],
    duration: "6 months",
    status: "Completed",
    outcomes: [
      "Identified key barriers to advancement",
      "Mapped leadership pathways",
      "Documented organizational practices"
    ]
  },
  {
    phase: "Analysis",
    icon: LineChart,
    methods: [
      {
        title: "Quantitative Analysis",
        count: "10,443 data points",
        description: "Statistical analysis of survey responses"
      },
      {
        title: "Qualitative Analysis",
        count: "200+ hours",
        description: "Thematic analysis of interviews and focus groups"
      },
      {
        title: "Policy Review",
        count: "403 organizations",
        description: "Assessment of organizational policies"
      }
    ],
    duration: "4 months",
    status: "Completed",
    outcomes: [
      "Evidence-based insights",
      "Cross-country comparisons",
      "Policy effectiveness metrics"
    ]
  },
  {
    phase: "Implementation",
    icon: Target,
    methods: [
      {
        title: "Pilot Programs",
        count: "15 organizations",
        description: "Testing interventions in selected institutions"
      },
      {
        title: "Leadership Development",
        count: "300+ participants",
        description: "Targeted training and mentorship programs"
      },
      {
        title: "Policy Reform",
        count: "25 initiatives",
        description: "Evidence-based policy recommendations"
      }
    ],
    duration: "Ongoing",
    status: "In Progress",
    outcomes: [
      "Increased women representation",
      "Improved organizational practices",
      "Sustainable change frameworks"
    ]
  }
];

export default function AboutPage() {
  return (
    <div className="bg-white">
      {/* Hero Section */}
      <Hero
        title="About WIHL"
        subtitle="Driving organizational change for women in healthcare leadership"
        image="https://images.unsplash.com/photo-1576091160399-112ba8d25d1d"
        height="half"
      />

      {/* About the Project Section */}
      <section className="py-24 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-[#06205c]">About the Project</h2>
            <p className="mt-4 text-xl text-gray-600">
              WIHL is a project funded by the Bill & Melinda Gates Foundation and implemented by Strathmore University Business School for a period of three (3) years. The project seeks to drive organizational change with regards to women leadership in mid-to-senior level positions across the Kenyan health sector.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-white shadow-lg p-8 hover:shadow-xl transition-all">
              <div className="w-12 h-12 bg-[#06205c]/10 rounded-lg flex items-center justify-center mb-6">
                <Globe className="h-6 w-6 text-[#06205c]" />
              </div>
              <h3 className="text-xl font-bold text-[#06205c] mb-4">Global Reach</h3>
              <p className="text-gray-600">
                The project is being implemented in Kenya, Nigeria, and India, with a focus on driving country-level change.
              </p>
            </div>
            <div className="bg-white shadow-lg p-8 hover:shadow-xl transition-all">
              <div className="w-12 h-12 bg-[#06205c]/10 rounded-lg flex items-center justify-center mb-6">
                <BookOpen className="h-6 w-6 text-[#06205c]" />
              </div>
              <h3 className="text-xl font-bold text-[#06205c] mb-4">Research-Driven</h3>
              <p className="text-gray-600">
                Comprehensive research and baselining efforts inform our interventions and advocacy.
              </p>
            </div>
            <div className="bg-white shadow-lg p-8 hover:shadow-xl transition-all">
              <div className="w-12 h-12 bg-[#06205c]/10 rounded-lg flex items-center justify-center mb-6">
                <ClipboardList className="h-6 w-6 text-[#06205c]" />
              </div>
              <h3 className="text-xl font-bold text-[#06205c] mb-4">Workstreams</h3>
              <p className="text-gray-600">
                Three workstreams: Consortium leadership, organizational change, and advocacy.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Objective Section */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-[#06205c]">Objective</h2>
            <p className="mt-4 text-xl text-gray-600">
              The overall objective of the project is to drive organizational change with regards to the career advancement of women in leadership within Kenya’s health sector.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-12">
            <div className="bg-gray-50 p-8 shadow-lg">
              <h3 className="text-2xl font-bold text-[#06205c] mb-6">Focus Areas</h3>
              <ul className="list-disc list-inside text-gray-600 space-y-3">
                <li>Organizational policies, leadership, culture, and structure.</li>
                <li>Advocacy efforts and interventions to remedy the status quo.</li>
              </ul>
            </div>
            <div className="bg-gray-50 p-8 shadow-lg">
              <h3 className="text-2xl font-bold text-[#06205c] mb-6">Theory of Change</h3>
              <p className="text-gray-600">
                Informed by Maes and Van Hootegem’s systems model of organizational change, the project considers both internal and external factors influencing women’s advancement.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Our Work Section */}
      <section className="py-24 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-[#06205c]">Our Work</h2>
            <p className="mt-4 text-xl text-gray-600">
              SBS is responsible for two workstreams: Consortium leadership and organizational change. KHF collaborates on advocacy efforts.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-white shadow-lg p-8 hover:shadow-xl transition-all">
              <div className="w-12 h-12 bg-[#06205c]/10 rounded-lg flex items-center justify-center mb-6">
                <TrendingUp className="h-6 w-6 text-[#06205c]" />
              </div>
              <h3 className="text-xl font-bold text-[#06205c] mb-4">Workstream 1</h3>
              <p className="text-gray-600">
                Consortium leadership and project management by SBS.
              </p>
            </div>
            <div className="bg-white shadow-lg p-8 hover:shadow-xl transition-all">
              <div className="w-12 h-12 bg-[#06205c]/10 rounded-lg flex items-center justify-center mb-6">
                <Building2 className="h-6 w-6 text-[#06205c]" />
              </div>
              <h3 className="text-xl font-bold text-[#06205c] mb-4">Workstream 2</h3>
              <p className="text-gray-600">
                Locally centered organizational change by SBS.
              </p>
            </div>
            <div className="bg-white shadow-lg p-8 hover:shadow-xl transition-all">
              <div className="w-12 h-12 bg-[#06205c]/10 rounded-lg flex items-center justify-center mb-6">
                <Users className="h-6 w-6 text-[#06205c]" />
              </div>
              <h3 className="text-xl font-bold text-[#06205c] mb-4">Workstream 3</h3>
              <p className="text-gray-600">
                Advocacy efforts by KHF and SBS.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Study Design Section */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-[#06205c]">Our Methodology</h2>
            <p className="mt-4 text-xl text-gray-600">
              A mixed-methods research design to establish a baseline for organizational elements that constrain or enable women’s advancement.
            </p>
          </div>

          <div className="grid lg:grid-cols-3 gap-8">
            {studyPhases.map((phase, index) => {
              const Icon = phase.icon;
              return (
                <div 
                  key={phase.phase}
                  className="bg-white shadow-lg p-8 hover:shadow-xl transition-all"
                >
                  <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center">
                      <div className="w-12 h-12 bg-[#06205c]/10 rounded-lg flex items-center justify-center">
                        <Icon className="h-6 w-6 text-[#06205c]" />
                      </div>
                      <div className="ml-4">
                        <h3 className="text-xl font-bold text-[#06205c]">{phase.phase}</h3>
                        <span className={`text-sm ${
                          phase.status === 'Completed' ? 'text-green-600' : 'text-blue-600'
                        }`}>
                          {phase.status}
                        </span>
                      </div>
                    </div>
                    <div className="text-sm text-gray-500">{phase.duration}</div>
                  </div>

                  <div className="space-y-6">
                    {phase.methods.map((method) => (
                      <div key={method.title} className="border-l-2 border-[#06205c] pl-4">
                        <div className="font-semibold text-[#06205c]">{method.title}</div>
                        <div className="text-sm text-[#06205c]/60 mt-1">{method.count}</div>
                        <div className="text-sm text-gray-600 mt-1">{method.description}</div>
                      </div>
                    ))}
                  </div>

                  <div className="mt-8 pt-6 border-t border-gray-100">
                    <h4 className="text-sm font-semibold text-[#06205c] mb-3">Key Outcomes</h4>
                    <ul className="space-y-2">
                      {phase.outcomes.map((outcome) => (
                        <li key={outcome} className="flex items-start text-sm text-gray-600">
                          <ArrowRight className="h-4 w-4 text-[#06205c] mr-2 mt-1 flex-shrink-0" />
                          <span>{outcome}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>
    </div>
  );
}