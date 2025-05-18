import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ChevronLeft, ChevronRight, Check, ArrowLeft } from 'lucide-react';
import { useExperiments } from '../contexts/ExperimentContext';
import { format } from 'date-fns';

const ExperimentSteps: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { getExperiment, completeStep, setCurrentExperiment } = useExperiments();
  
  const [experiment, setExperiment] = useState(id ? getExperiment(id) : undefined);
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  
  useEffect(() => {
    if (id) {
      const exp = getExperiment(id);
      setExperiment(exp);
      
      if (exp) {
        setCurrentExperiment(id);
        
        // Find the first non-completed step
        const nextStepIndex = exp.steps.findIndex((step) => !step.completed);
        if (nextStepIndex !== -1) {
          setCurrentStepIndex(nextStepIndex);
        }
      }
    }
  }, [id, getExperiment, setCurrentExperiment]);
  
  const goToPreviousStep = () => {
    if (currentStepIndex > 0) {
      setCurrentStepIndex(currentStepIndex - 1);
    }
  };
  
  const goToNextStep = () => {
    if (experiment && currentStepIndex < experiment.steps.length - 1) {
      setCurrentStepIndex(currentStepIndex + 1);
    }
  };
  
  const handleCompleteStep = () => {
    if (!id || !experiment) return;
    
    completeStep(id, currentStepIndex);
    
    // Automatically advance to the next step
    if (currentStepIndex < experiment.steps.length - 1) {
      setTimeout(() => {
        setCurrentStepIndex(currentStepIndex + 1);
      }, 800);
    }
  };
  
  if (!experiment) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="text-center">
          <h2 className="text-xl font-medium text-gray-900">Experiment not found</h2>
          <p className="mt-2 text-gray-600">
            The experiment you're looking for doesn't exist or has been deleted.
          </p>
          <button
            type="button"
            className="mt-4 btn btn-primary"
            onClick={() => navigate('/')}
          >
            Return to Dashboard
          </button>
        </div>
      </div>
    );
  }
  
  const currentStep = experiment.steps[currentStepIndex];
  
  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-4 flex items-center justify-between">
        <button
          type="button"
          className="flex items-center text-sm font-medium text-gray-700 hover:text-primary-600"
          onClick={() => navigate(`/experiments/${id}`)}
        >
          <ArrowLeft className="mr-1 h-4 w-4" />
          Back to Experiment
        </button>
        
        <div className="text-right">
          <h2 className="text-lg font-medium text-gray-900">{experiment.title}</h2>
          <p className="text-sm text-gray-500">Step {currentStepIndex + 1} of {experiment.steps.length}</p>
        </div>
      </div>
      
      {/* Progress bar */}
      <div className="mb-8">
        <div className="flex justify-between text-sm text-gray-500">
          <span>Progress</span>
          <span>{experiment.progress}%</span>
        </div>
        <div className="mt-1 h-2 w-full overflow-hidden rounded-full bg-gray-200">
          <div
            className="h-2 rounded-full bg-primary-600 transition-all duration-500"
            style={{ width: `${experiment.progress}%` }}
          ></div>
        </div>
      </div>
      
      {/* Step display */}
      <div className="relative min-h-[400px] rounded-lg bg-white shadow-lg">
        {/* Step content */}
        <div 
          className="flex min-h-[400px] flex-col items-center justify-center p-8 text-center"
          key={currentStepIndex}
        >
          <div className="mb-6">
            <div 
              className={`mx-auto flex h-20 w-20 items-center justify-center rounded-full ${
                currentStep.completed ? 'bg-green-100' : 'bg-primary-100'
              }`}
            >
              {currentStep.completed ? (
                <Check className="h-10 w-10 text-green-600" />
              ) : (
                <span className="text-2xl font-semibold text-primary-600">
                  {currentStepIndex + 1}
                </span>
              )}
            </div>
          </div>
          
          <h3 className="mb-4 text-2xl font-semibold text-gray-900 animate-fade-in">
            {currentStep.description}
          </h3>
          
          {currentStep.estimatedDuration && (
            <p className="mb-6 text-gray-500 animate-fade-in">
              Estimated duration: {currentStep.estimatedDuration} minutes
            </p>
          )}
          
          {currentStep.scheduledTime && (
            <p className="mb-6 text-gray-500 animate-fade-in">
              Scheduled for: {format(new Date(currentStep.scheduledTime), 'h:mm a')}
            </p>
          )}
          
          {experiment.startedAt && !currentStep.completed ? (
            <button
              type="button"
              className="mt-4 btn btn-primary px-8 py-3 animate-slide-up"
              onClick={handleCompleteStep}
            >
              Mark as Completed
            </button>
          ) : currentStep.completed ? (
            <div className="mt-4 rounded-md bg-green-50 px-4 py-3 text-green-800 animate-fade-in">
              Completed on {format(new Date(currentStep.completedAt!), 'MMM d, yyyy')} at {format(new Date(currentStep.completedAt!), 'h:mm a')}
            </div>
          ) : (
            <div className="mt-4 rounded-md bg-amber-50 px-4 py-3 text-amber-800 animate-fade-in">
              Experiment must be started to complete this step
            </div>
          )}
        </div>
        
        {/* Navigation buttons */}
        <div className="absolute inset-x-0 bottom-0 flex justify-between p-4">
          <button
            type="button"
            className={`flex items-center rounded-md bg-gray-100 px-3 py-2 text-sm font-medium ${
              currentStepIndex === 0
                ? 'cursor-not-allowed opacity-50'
                : 'text-gray-700 hover:bg-gray-200'
            }`}
            onClick={goToPreviousStep}
            disabled={currentStepIndex === 0}
          >
            <ChevronLeft className="mr-1 h-5 w-5" />
            Previous
          </button>
          
          <button
            type="button"
            className={`flex items-center rounded-md bg-gray-100 px-3 py-2 text-sm font-medium ${
              currentStepIndex === experiment.steps.length - 1
                ? 'cursor-not-allowed opacity-50'
                : 'text-gray-700 hover:bg-gray-200'
            }`}
            onClick={goToNextStep}
            disabled={currentStepIndex === experiment.steps.length - 1}
          >
            Next
            <ChevronRight className="ml-1 h-5 w-5" />
          </button>
        </div>
        
        {/* Step dots */}
        <div className="absolute inset-x-0 bottom-16 flex justify-center space-x-2">
          {experiment.steps.map((step, index) => (
            <button
              key={index}
              type="button"
              className={`h-2 w-2 rounded-full ${
                currentStepIndex === index
                  ? 'bg-primary-600'
                  : step.completed
                  ? 'bg-green-500'
                  : 'bg-gray-300'
              }`}
              onClick={() => setCurrentStepIndex(index)}
              aria-label={`Go to step ${index + 1}`}
            ></button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ExperimentSteps;