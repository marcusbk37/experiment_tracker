import React, { createContext, useContext, useState, useEffect } from 'react';
import { ExperimentType, ExperimentStep } from '../types';

interface ExperimentContextType {
  experiments: ExperimentType[];
  currentExperiment: ExperimentType | null;
  addExperiment: (experiment: ExperimentType) => void;
  updateExperiment: (id: string, experiment: Partial<ExperimentType>) => void;
  getExperiment: (id: string) => ExperimentType | undefined;
  setCurrentExperiment: (id: string) => void;
  completeStep: (experimentId: string, stepIndex: number) => void;
  deleteExperiment: (id: string) => void;
}

const ExperimentContext = createContext<ExperimentContextType | undefined>(undefined);

export const ExperimentProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [experiments, setExperiments] = useState<ExperimentType[]>(() => {
    const savedExperiments = localStorage.getItem('experiments');
    return savedExperiments ? JSON.parse(savedExperiments) : [];
  });
  
  const [currentExperiment, setCurrentExperimentState] = useState<ExperimentType | null>(null);

  useEffect(() => {
    localStorage.setItem('experiments', JSON.stringify(experiments));
  }, [experiments]);

  const addExperiment = (experiment: ExperimentType) => {
    setExperiments([...experiments, experiment]);
  };

  const updateExperiment = (id: string, experimentUpdates: Partial<ExperimentType>) => {
    setExperiments(
      experiments.map((exp) => 
        exp.id === id ? { ...exp, ...experimentUpdates } : exp
      )
    );
    
    // Update current experiment if it's the one being updated
    if (currentExperiment?.id === id) {
      setCurrentExperimentState({
        ...currentExperiment,
        ...experimentUpdates,
      });
    }
  };

  const getExperiment = (id: string) => {
    return experiments.find((exp) => exp.id === id);
  };

  const setCurrentExperiment = (id: string) => {
    const experiment = getExperiment(id);
    if (experiment) {
      setCurrentExperimentState(experiment);
    }
  };

  const completeStep = (experimentId: string, stepIndex: number) => {
    setExperiments(
      experiments.map((exp) => {
        if (exp.id === experimentId) {
          const updatedSteps = [...exp.steps];
          updatedSteps[stepIndex] = {
            ...updatedSteps[stepIndex],
            completed: true,
            completedAt: new Date().toISOString(),
          };
          
          return {
            ...exp,
            steps: updatedSteps,
            progress: Math.round(
              (updatedSteps.filter((step) => step.completed).length / updatedSteps.length) * 100
            ),
          };
        }
        return exp;
      })
    );
    
    // Update current experiment if it's the one being modified
    if (currentExperiment?.id === experimentId) {
      const updatedSteps = [...currentExperiment.steps];
      updatedSteps[stepIndex] = {
        ...updatedSteps[stepIndex],
        completed: true,
        completedAt: new Date().toISOString(),
      };
      
      setCurrentExperimentState({
        ...currentExperiment,
        steps: updatedSteps,
        progress: Math.round(
          (updatedSteps.filter((step) => step.completed).length / updatedSteps.length) * 100
        ),
      });
    }
  };

  const deleteExperiment = (id: string) => {
    setExperiments(experiments.filter((exp) => exp.id !== id));
    
    // Reset current experiment if it's the one being deleted
    if (currentExperiment?.id === id) {
      setCurrentExperimentState(null);
    }
  };

  return (
    <ExperimentContext.Provider
      value={{
        experiments,
        currentExperiment,
        addExperiment,
        updateExperiment,
        getExperiment,
        setCurrentExperiment,
        completeStep,
        deleteExperiment,
      }}
    >
      {children}
    </ExperimentContext.Provider>
  );
};

export const useExperiments = () => {
  const context = useContext(ExperimentContext);
  if (context === undefined) {
    throw new Error('useExperiments must be used within an ExperimentProvider');
  }
  return context;
};