import { 
  ArrowRight, 
  BarChart, 
  FileText,
  Users,
  Building2,
  Target,
  PieChart,
  BookOpen,
  Shield,
  TrendingUp,
  Globe,
  Clipboard,
  Heart,
  Smile,
  Download,
  Target as TargetIcon,
  ClipboardList,
  Network,
  Scale,
  UserCheck
} from 'lucide-react';
import Hero from '../../components/Hero';

const findings = {
  quantitative: [
    {
      category: 'Demographic Distribution',
      points: [
        'Women represent 65% of healthcare workforce but only 25% of leadership positions',
        'Average age of women leaders is 42 years',
        'Over 80% hold advanced degrees or specialized certifications'
      ]
    },
    {
      category: 'Career Progression',
      points: [
        'Only 15% of women reach senior management within 10 years',
        'Promotion rate is 2.5x slower compared to male counterparts',
        'Leadership roles concentrate in specific departments (HR, Nursing)'
      ]
    },
    {
      category: 'Organizational Metrics',
      points: [
        'Gender pay gap of 22% at leadership levels',
        'Only 30% of organizations have formal mentorship programs',
        'Leadership development budgets show 40% disparity'
      ]
    }
  ],
  qualitative: [
    {
      category: 'Cultural Barriers',
      quote: "The unwritten rules and informal networks often feel exclusionary to women leaders",
      findings: [
        'Persistent gender stereotypes in leadership roles',
        'Lack of visible role models in senior positions',
        'Informal networking challenges'
      ]
    },
    {
      category: 'Work-Life Integration',
      quote: "Balancing leadership responsibilities with societal expectations remains a significant challenge",
      findings: [
        'Limited flexible work arrangements at senior levels',
        'Disproportionate family responsibilities impact',
        'Insufficient support systems for women leaders'
      ]
    },
    {
      category: 'Institutional Practices',
      quote: "Current policies often overlook the unique challenges faced by women in leadership paths",
      findings: [
        'Bias in performance evaluation criteria',
        'Limited sponsorship opportunities',
        'Inadequate succession planning'
      ]
    }
  ]
};

const recommendations = [
  {
    icon: Users,
    title: 'Leadership Development Programs',
    description: 'Implement structured mentorship and leadership training programs specifically designed for women in healthcare.',
    actions: [
      'Create formal mentorship matching systems',
      'Develop leadership skills workshops',
      'Establish peer support networks'
    ]
  },
  {
    icon: Building2,
    title: 'Policy Reform',
    description: 'Establish clear policies promoting gender equity in recruitment, promotion, and leadership positions.',
    actions: [
      'Review and update promotion criteria',
      'Implement transparent pay scales',
      'Create inclusive hiring practices'
    ]
  },
  {
    icon: Target,
    title: 'Organizational Change',
    description: 'Transform workplace culture to actively support and celebrate women leaders.',
    actions: [
      'Set diversity targets for leadership positions',
      'Create accountability mechanisms',
      'Measure and report progress regularly'
    ]
  }
];

const keyConcepts = [
  {
    icon: BookOpen,
    title: 'Leaky Pipeline',
    description: 'Women leave the workforce or fail to advance due to structural and cultural barriers.'
  },
  {
    icon: Shield,
    title: 'Gender Equality',
    description: 'Equal access to resources, opportunities, and rights for all genders.'
  },
  {
    icon: TrendingUp,
    title: 'Gender Equity',
    description: 'Fair treatment and tailored opportunities to address systemic inequalities.'
  },
  {
    icon: Globe,
    title: 'Glass Ceiling',
    description: 'Invisible barriers preventing women from reaching top-level positions.'
  },
  {
    icon: Clipboard,
    title: 'Sticky Floor',
    description: 'Systemic issues keeping women in low-wage, low-mobility jobs.'
  },
  {
    icon: Heart,
    title: 'Glass Cliff',
    description: 'Women placed in leadership roles during crises, increasing failure risk.'
  },
  {
    icon: Smile,
    title: 'Labyrinth',
    description: 'Complex path women navigate to reach leadership positions.'
  }
];

const objectives = [
  {
    icon: TargetIcon,
    title: 'Equitable Advancement',
    description: 'Determine equitable advancement of men and women across organizational levels.'
  },
  {
    icon: ClipboardList,
    title: 'Organizational Structure',
    description: 'Examine the role of organizational structure, policies, and culture in career progression.'
  },
  {
    icon: Network,
    title: 'Leadership Impact',
    description: 'Investigate the impact of leadership, peer support networks, and male allies.'
  },
  {
    icon: Scale,
    title: 'Policy Effectiveness',
    description: 'Assess the effectiveness of existing interventions and legal frameworks.'
  },
  {
    icon: UserCheck,
    title: 'Gender Equity',
    description: 'Promote gender equity through inclusive policies and practices.'
  },
  {
    icon: BarChart, // Replaced ChartBar with BarChart
    title: 'Data-Driven Insights',
    description: 'Collect and analyze data to inform evidence-based strategies for gender equity.'
  }
];

export default function ResearchPage() {
  return (
    <div className="bg-white">
      {/* Hero Section */}
      <Hero
        title="Advancing Women's Leadership in the Kenyan Health Sector"
        subtitle="Are the rungs on the organizational ladder broken or is there no ladder at all?"
        image="https://images.unsplash.com/photo-1532938911079-1b06ac7ceec7"
        height="half"
      />

      {/* Key Concepts Section */}
      <div className="py-24 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-[#06205c] mb-8 text-center">Key Concepts</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {keyConcepts.map((item, index) => (
              <div key={index} className="bg-white shadow-lg p-6 hover:shadow-xl transition-all">
                <div className="w-12 h-12 bg-[#06205c]/10 flex items-center justify-center mb-4">
                  <item.icon className="h-6 w-6 text-[#06205c]" />
                </div>
                <h3 className="text-xl font-bold text-[#06205c] mb-4">{item.title}</h3>
                <p className="text-gray-600">{item.description}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Project Overview Section */}
      <div className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-[#06205c] mb-8 text-center">Project Overview</h2>

          {/* Purpose Card */}
          <div className="bg-gray-50 shadow-lg p-8 mb-12">
            <h3 className="text-2xl font-bold text-[#06205c] mb-6">Purpose</h3>
            <p className="text-gray-600">
              This project examines how organizational elements—structure, leadership, culture, and policies—constrain or promote women's career advancement in Kenyan health sector organizations. By identifying barriers and opportunities, we aim to provide actionable insights for creating a more inclusive and equitable workplace.
            </p>
          </div>

          {/* Objectives Cards */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {objectives.map((item, index) => {
              const Icon = item.icon;
              return (
                <div key={index} className="bg-gray-50 shadow-lg p-6 hover:shadow-xl transition-all">
                  <div className="w-12 h-12 bg-[#06205c]/10 flex items-center justify-center mb-4">
                    <Icon className="h-6 w-6 text-[#06205c]" />
                  </div>
                  <h3 className="text-xl font-bold text-[#06205c] mb-4">{item.title}</h3>
                  <p className="text-gray-600">{item.description}</p>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Findings Section */}
      <div className="py-24 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-[#06205c] mb-8 text-center">Findings</h2>
          <div className="space-y-16">
            {/* Quantitative Findings */}
            <div>
              <h3 className="text-2xl font-bold text-[#06205c] mb-8">Quantitative Findings</h3>
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                {findings.quantitative.map((item, index) => (
                  <div key={index} className="bg-white shadow-lg p-6 hover:shadow-xl transition-all">
                    <div className="w-12 h-12 bg-[#06205c]/10 flex items-center justify-center mb-4">
                      <BarChart className="h-6 w-6 text-[#06205c]" />
                    </div>
                    <h3 className="text-xl font-bold text-[#06205c] mb-4">{item.category}</h3>
                    <ul className="space-y-3">
                      {item.points.map((point, idx) => (
                        <li key={idx} className="flex items-start">
                          <ArrowRight className="h-5 w-5 text-[#06205c] mr-2 mt-1 flex-shrink-0" />
                          <span className="text-gray-600">{point}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </div>

            {/* Qualitative Findings */}
            <div>
              <h3 className="text-2xl font-bold text-[#06205c] mb-8">Qualitative Findings</h3>
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                {findings.qualitative.map((item, index) => (
                  <div key={index} className="bg-white shadow-lg p-6 hover:shadow-xl transition-all">
                    <div className="w-12 h-12 bg-[#06205c]/10 flex items-center justify-center mb-4">
                      <FileText className="h-6 w-6 text-[#06205c]" />
                    </div>
                    <h3 className="text-xl font-bold text-[#06205c] mb-4">{item.category}</h3>
                    <blockquote className="italic text-gray-600 border-l-4 border-[#06205c] pl-4 mb-4">
                      {item.quote}
                    </blockquote>
                    <ul className="space-y-3">
                      {item.findings.map((finding, idx) => (
                        <li key={idx} className="flex items-start">
                          <ArrowRight className="h-5 w-5 text-[#06205c] mr-2 mt-1 flex-shrink-0" />
                          <span className="text-gray-600">{finding}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Recommendations Section */}
      <div className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-[#06205c] mb-8 text-center">Key Recommendations</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {recommendations.map((item, index) => {
              const Icon = item.icon;
              return (
                <div key={index} className="bg-gray-50 shadow-lg p-8 hover:shadow-xl transition-all">
                  <div className="w-12 h-12 bg-[#06205c]/10 flex items-center justify-center mb-6">
                    <Icon className="h-6 w-6 text-[#06205c]" />
                  </div>
                  <h3 className="text-xl font-bold text-[#06205c] mb-4">{item.title}</h3>
                  <p className="text-gray-600 mb-6">{item.description}</p>
                  <ul className="space-y-3">
                    {item.actions.map((action, idx) => (
                      <li key={idx} className="flex items-start">
                        <ArrowRight className="h-5 w-5 text-[#06205c] mr-2 mt-1 flex-shrink-0" />
                        <span className="text-gray-600">{action}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Conclusion Section */}
      <div className="py-24 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-3xl font-bold text-[#06205c] mb-8">Conclusion</h2>
            <p className="text-gray-600 text-xl mb-8">
              The future of women in health leadership in Kenya depends on intentional efforts, systemic changes, and creating a gender-inclusive environment. By addressing challenges through policy reforms, education, and cultural shifts, the healthcare sector can unlock its full potential and improve health outcomes for all.
            </p>
            <p className="text-gray-600">
              <strong>Dr. Angela Ndunge</strong><br />
              Strathmore University Business School
            </p>
          </div>
        </div>
      </div>

      {/* Call to Action Section */}
      <div className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-3xl font-bold text-[#06205c] mb-8">Download the Full Report</h2>
            <p className="text-gray-600 text-xl mb-8">
              Access the complete findings, recommendations, and insights from this groundbreaking study.
            </p>
            <button className="bg-[#06205c] text-white px-8 py-3 flex items-center justify-center mx-auto hover:bg-[#06205c]/90 transition-all">
              <Download className="h-5 w-5 mr-2" />
              Download Full Report
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}