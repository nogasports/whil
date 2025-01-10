import React from 'react';
import { Save } from 'lucide-react';
import { useFirestore } from '../../lib/hooks/useFirestore';
import { Project } from '../../types/firebase';

export default function AboutProjectTab() {
  const { data: projects, loading, error, add, update } = useFirestore<Project>({
    collection: 'projects'
  });

  const project = projects[0]; // We'll work with the first project

  const [missionStatement, setMissionStatement] = React.useState(project?.missionStatement || '');
  const [goals, setGoals] = React.useState<string[]>(project?.goals || ['Research Excellence', 'Leadership Development', 'Community Building']);
  const [startDate, setStartDate] = React.useState(project?.timeline?.startDate || '');
  const [endDate, setEndDate] = React.useState(project?.timeline?.endDate || '');
  const [description, setDescription] = React.useState(project?.description || '');

  React.useEffect(() => {
    if (project) {
      setMissionStatement(project.missionStatement);
      setGoals(project.goals);
      setStartDate(project.timeline.startDate);
      setEndDate(project.timeline.endDate);
      setDescription(project.description);
    }
  }, [project]);

  const handleSave = async () => {
    const projectData = {
      missionStatement,
      goals,
      timeline: { startDate, endDate },
      description
    };

    if (project?.id) {
      await update(project.id, projectData);
    } else {
      await add(projectData);
    }
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold text-gray-900">About WIHL Project</h2>
        <button
          onClick={handleSave}
          className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700"
        >
          <Save className="h-4 w-4 mr-2" />
          Save Changes
        </button>
      </div>

      <div className="space-y-6">
        {/* Mission Section */}
        <section className="bg-white rounded-lg shadow-sm p-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Mission Statement</h3>
          <textarea
            rows={4}
            className="w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
            value={missionStatement}
            onChange={(e) => setMissionStatement(e.target.value)}
            placeholder="Enter mission statement..."
          />
        </section>

        {/* Goals Section */}
        <section className="bg-white rounded-lg shadow-sm p-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Project Goals</h3>
          <div className="space-y-4">
            {goals.map((goal, index) => (
              <div key={index} className="flex items-start space-x-4">
                <div className="flex-shrink-0 w-8 h-8 rounded-full bg-indigo-100 flex items-center justify-center">
                  <span className="text-indigo-600 font-medium">{index + 1}</span>
                </div>
                <div className="flex-1">
                  <input
                    value={goal}
                    onChange={(e) => {
                      const newGoals = [...goals];
                      newGoals[index] = e.target.value;
                      setGoals(newGoals);
                    }}
                    type="text"
                    className="w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                  />
                </div>
              </div>
            ))}
            <button
              onClick={() => setGoals([...goals, ''])}
              className="text-indigo-600 hover:text-indigo-700 text-sm font-medium"
            >
              + Add Goal
            </button>
          </div>
        </section>

        {/* Timeline Section */}
        <section className="bg-white rounded-lg shadow-sm p-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Project Timeline</h3>
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Start Date
                </label>
                <input
                  type="date"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  className="w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  End Date
                </label>
                <input
                  type="date"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                  className="w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                />
              </div>
            </div>
          </div>
        </section>

        {/* Description Section */}
        <section className="bg-white rounded-lg shadow-sm p-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Project Description</h3>
          <textarea
            rows={6}
            className="w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Enter detailed project description..."
          />
        </section>
      </div>
    </div>
  );
}