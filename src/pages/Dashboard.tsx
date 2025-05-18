import React from 'react';
import { Link } from 'react-router-dom';
import { Calendar, Clock, Beaker, PlusCircle, ArrowRight } from 'lucide-react';
import { useExperiments } from '../contexts/ExperimentContext';
import { format } from 'date-fns';

const Dashboard: React.FC = () => {
  const { experiments } = useExperiments();
  
  const activeExperiments = experiments.filter(
    (exp) => exp.startedAt && !exp.completedAt
  );
  
  const recentExperiments = [...experiments]
    .sort((a, b) => {
      return new Date(b.uploadedAt).getTime() - new Date(a.uploadedAt).getTime();
    })
    .slice(0, 5);
  
  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">Lab Dashboard</h1>
        <Link 
          to="/upload" 
          className="btn btn-primary"
        >
          <PlusCircle className="mr-2 h-4 w-4" />
          New Experiment
        </Link>
      </div>
      
      {experiments.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-lg border border-dashed border-gray-300 p-8 text-center">
          <Beaker className="mb-4 h-16 w-16 text-gray-400" />
          <h2 className="text-xl font-medium text-gray-900">No experiments yet</h2>
          <p className="mt-1 text-gray-500">
            Upload your first protocol to start tracking experiments
          </p>
          <Link 
            to="/upload" 
            className="mt-4 btn btn-primary"
          >
            <PlusCircle className="mr-2 h-4 w-4" />
            Upload Protocol
          </Link>
        </div>
      ) : (
        <>
          {/* Active experiments */}
          <section>
            <h2 className="mb-4 text-xl font-semibold text-gray-900">Active Experiments</h2>
            
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
              {activeExperiments.length > 0 ? (
                activeExperiments.map((experiment) => (
                  <Link
                    key={experiment.id}
                    to={`/experiments/${experiment.id}`}
                    className="card p-4 hover:bg-gray-50"
                  >
                    <h3 className="text-lg font-medium text-gray-900">{experiment.title}</h3>
                    
                    <div className="mt-2 flex items-center text-sm text-gray-500">
                      <Calendar className="mr-1 h-4 w-4" />
                      Started: {format(new Date(experiment.startedAt!), 'MMM d, yyyy')}
                    </div>
                    
                    <div className="mt-4">
                      <div className="flex justify-between text-sm">
                        <span>Progress</span>
                        <span>{experiment.progress}%</span>
                      </div>
                      <div className="mt-1 h-2 w-full rounded-full bg-gray-200">
                        <div
                          className="h-2 rounded-full bg-primary-600"
                          style={{ width: `${experiment.progress}%` }}
                        ></div>
                      </div>
                    </div>
                    
                    <div className="mt-4 flex justify-between">
                      <div className="text-sm text-gray-600">
                        {experiment.steps.filter((step) => step.completed).length} of {experiment.steps.length} steps completed
                      </div>
                      <ArrowRight className="h-5 w-5 text-primary-600" />
                    </div>
                  </Link>
                ))
              ) : (
                <div className="col-span-full rounded-lg border border-dashed border-gray-300 p-6 text-center">
                  <p className="text-gray-500">No active experiments</p>
                </div>
              )}
            </div>
          </section>
          
          {/* Recent experiments */}
          <section>
            <h2 className="mb-4 text-xl font-semibold text-gray-900">Recent Experiments</h2>
            
            <div className="overflow-hidden rounded-lg border border-gray-200 bg-white">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                      Experiment
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                      Created
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                      Status
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                      Progress
                    </th>
                    <th className="px-6 py-3 text-right text-xs font-medium uppercase tracking-wider text-gray-500">
                      Steps
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 bg-white">
                  {recentExperiments.map((experiment) => (
                    <tr
                      key={experiment.id}
                      className="hover:bg-gray-50"
                      onClick={() => {
                        window.location.href = `/experiments/${experiment.id}`;
                      }}
                      style={{ cursor: 'pointer' }}
                    >
                      <td className="whitespace-nowrap px-6 py-4">
                        <div className="font-medium text-gray-900">
                          {experiment.title}
                        </div>
                      </td>
                      <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-500">
                        {format(new Date(experiment.uploadedAt), 'MMM d, yyyy')}
                      </td>
                      <td className="whitespace-nowrap px-6 py-4 text-sm">
                        {experiment.completedAt ? (
                          <span className="inline-flex items-center rounded-full bg-green-100 px-2.5 py-0.5 text-xs font-medium text-green-800">
                            Completed
                          </span>
                        ) : experiment.startedAt ? (
                          <span className="inline-flex items-center rounded-full bg-blue-100 px-2.5 py-0.5 text-xs font-medium text-blue-800">
                            In Progress
                          </span>
                        ) : (
                          <span className="inline-flex items-center rounded-full bg-gray-100 px-2.5 py-0.5 text-xs font-medium text-gray-800">
                            Not Started
                          </span>
                        )}
                      </td>
                      <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-500">
                        <div className="flex items-center">
                          <div className="h-2 w-24 rounded-full bg-gray-200">
                            <div
                              className="h-2 rounded-full bg-primary-600"
                              style={{ width: `${experiment.progress}%` }}
                            ></div>
                          </div>
                          <span className="ml-2">{experiment.progress}%</span>
                        </div>
                      </td>
                      <td className="whitespace-nowrap px-6 py-4 text-right text-sm text-gray-500">
                        {experiment.steps.filter((step) => step.completed).length}/{experiment.steps.length}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>
        </>
      )}
    </div>
  );
};

export default Dashboard;