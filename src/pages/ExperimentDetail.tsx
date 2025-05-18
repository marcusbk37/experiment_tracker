import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Calendar, Clock, ArrowRight, PlayCircle, Edit, Trash2 } from 'lucide-react';
import { useExperiments } from '../contexts/ExperimentContext';
import { format, addMinutes } from 'date-fns';
import { useNotification } from '../contexts/NotificationContext';

const ExperimentDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { experiments, getExperiment, updateExperiment, deleteExperiment, setCurrentExperiment } = useExperiments();
  const { scheduleNotification } = useNotification();
  
  const [experiment, setExperiment] = useState(
    id ? getExperiment(id) : undefined
  );
  
  useEffect(() => {
    if (id) {
      const exp = getExperiment(id);
      setExperiment(exp);
      
      if (exp) {
        setCurrentExperiment(id);
      }
    }
  }, [id, experiments, getExperiment, setCurrentExperiment]);
  
  const handleStartExperiment = () => {
    if (!experiment || !id) return;
    
    const now = new Date();
    let scheduledTime = new Date(now);
    
    // Schedule notifications for each step
    experiment.steps.forEach((step, index) => {
      // For this demo, we'll schedule each step 1 minute apart
      // In a real app, you would use the estimated duration
      scheduledTime = addMinutes(scheduledTime, step.estimatedDuration || 1);
      
      const updatedStep = {
        ...step,
        scheduledTime: scheduledTime.toISOString(),
      };
      
      scheduleNotification(id, index, updatedStep);
    });
    
    // Update experiment with start time
    updateExperiment(id, {
      startedAt: now.toISOString(),
      steps: experiment.steps.map((step, index) => ({
        ...step,
        scheduledTime: addMinutes(now, (step.estimatedDuration || 1) * index).toISOString(),
      })),
    });
  };
  
  const handleDeleteExperiment = () => {
    if (!id || !confirm('Are you sure you want to delete this experiment?')) return;
    
    deleteExperiment(id);
    window.location.href = '/';
  };
  
  if (!experiment) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="text-center">
          <h2 className="text-xl font-medium text-gray-900">Experiment not found</h2>
          <p className="mt-2 text-gray-600">
            The experiment you're looking for doesn't exist or has been deleted.
          </p>
          <Link to="/" className="mt-4 btn btn-primary">
            Return to Dashboard
          </Link>
        </div>
      </div>
    );
  }
  
  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">{experiment.title}</h1>
        
        <div className="flex space-x-2">
          <button className="btn btn-outline">
            <Edit className="mr-2 h-4 w-4" />
            Edit
          </button>
          
          <button 
            className="btn btn-outline text-red-600 hover:bg-red-50"
            onClick={handleDeleteExperiment}
          >
            <Trash2 className="mr-2 h-4 w-4" />
            Delete
          </button>
        </div>
      </div>
      
      <div className="mb-8 rounded-lg bg-white p-6 shadow-sm">
        <div className="mb-4">
          <h2 className="mb-2 text-lg font-medium text-gray-900">Experiment Details</h2>
          <p className="text-gray-600">{experiment.description}</p>
        </div>
        
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          <div className="rounded-md bg-gray-50 p-4">
            <div className="flex items-center">
              <Calendar className="mr-2 h-5 w-5 text-gray-400" />
              <span className="text-sm font-medium text-gray-500">Created</span>
            </div>
            <p className="mt-1 text-gray-900">
              {format(new Date(experiment.uploadedAt), 'MMM d, yyyy')}
            </p>
          </div>
          
          <div className="rounded-md bg-gray-50 p-4">
            <div className="flex items-center">
              <Clock className="mr-2 h-5 w-5 text-gray-400" />
              <span className="text-sm font-medium text-gray-500">Status</span>
            </div>
            <p className="mt-1 text-gray-900">
              {experiment.completedAt
                ? 'Completed'
                : experiment.startedAt
                ? 'In Progress'
                : 'Not Started'}
            </p>
          </div>
          
          <div className="rounded-md bg-gray-50 p-4">
            <div className="flex items-center">
              <div className="mr-2 h-5 w-5 flex items-center justify-center">
                <div className="h-4 w-4 rounded-full border-4 border-gray-400"></div>
              </div>
              <span className="text-sm font-medium text-gray-500">Progress</span>
            </div>
            <div className="mt-2 flex items-center">
              <div className="h-2 flex-1 rounded-full bg-gray-200">
                <div
                  className="h-2 rounded-full bg-primary-600"
                  style={{ width: `${experiment.progress}%` }}
                ></div>
              </div>
              <span className="ml-2 text-gray-900">{experiment.progress}%</span>
            </div>
          </div>
        </div>
        
        {!experiment.startedAt && (
          <div className="mt-6 border-t border-gray-200 pt-6">
            <button
              type="button"
              className="btn btn-primary"
              onClick={handleStartExperiment}
            >
              <PlayCircle className="mr-2 h-5 w-5" />
              Start Experiment
            </button>
            <p className="mt-2 text-sm text-gray-500">
              Starting the experiment will schedule notifications for each step.
            </p>
          </div>
        )}
      </div>
      
      <div className="mb-8">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-lg font-medium text-gray-900">Experiment Steps</h2>
          
          <Link
            to={`/experiments/${experiment.id}/steps`}
            className="text-sm font-medium text-primary-600 hover:text-primary-700"
          >
            View as Slideshow <ArrowRight className="ml-1 inline h-4 w-4" />
          </Link>
        </div>
        
        <div className="space-y-4">
          {experiment.steps.map((step, index) => (
            <div
              key={index}
              className={`rounded-lg border ${
                step.completed
                  ? 'border-green-200 bg-green-50'
                  : experiment.startedAt
                  ? 'border-primary-200 bg-primary-50'
                  : 'border-gray-200 bg-white'
              } p-4`}
            >
              <div className="flex items-start">
                <div
                  className={`mr-4 flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full ${
                    step.completed
                      ? 'bg-green-100 text-green-800'
                      : experiment.startedAt
                      ? 'bg-primary-100 text-primary-800'
                      : 'bg-gray-100 text-gray-800'
                  }`}
                >
                  {index + 1}
                </div>
                
                <div className="flex-1">
                  <p className="font-medium text-gray-900">{step.description}</p>
                  
                  <div className="mt-2 flex flex-wrap items-center gap-x-4 gap-y-2 text-sm text-gray-500">
                    {step.estimatedDuration && (
                      <div className="flex items-center">
                        <Clock className="mr-1 h-4 w-4" />
                        <span>{step.estimatedDuration} minutes</span>
                      </div>
                    )}
                    
                    {step.scheduledTime && (
                      <div className="flex items-center">
                        <Calendar className="mr-1 h-4 w-4" />
                        <span>
                          Scheduled: {format(new Date(step.scheduledTime), 'h:mm a')}
                        </span>
                      </div>
                    )}
                    
                    {step.completed && step.completedAt && (
                      <div className="flex items-center text-green-600">
                        <div className="mr-1 h-4 w-4 rounded-full bg-green-600"></div>
                        <span>
                          Completed: {format(new Date(step.completedAt), 'h:mm a')}
                        </span>
                      </div>
                    )}
                  </div>
                </div>
                
                {experiment.startedAt && !step.completed && (
                  <button
                    type="button"
                    className="ml-4 rounded-md bg-primary-600 px-3 py-1.5 text-sm font-medium text-white hover:bg-primary-700"
                    onClick={() => {
                      if (id) {
                        updateExperiment(id, {
                          steps: experiment.steps.map((s, i) => 
                            i === index ? { ...s, completed: true, completedAt: new Date().toISOString() } : s
                          ),
                          progress: Math.round(
                            ((experiment.steps.filter((s) => s.completed).length + 1) / experiment.steps.length) * 100
                          ),
                        });
                      }
                    }}
                  >
                    Mark Complete
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ExperimentDetail;