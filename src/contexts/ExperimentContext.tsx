import React, { createContext, useContext, useState, useEffect } from 'react';
import { toast } from 'sonner';
import { supabase } from '../lib/supabase';
import { ExperimentType, ExperimentStep } from '../types';

interface ExperimentContextType {
  experiments: ExperimentType[];
  currentExperiment: ExperimentType | null;
  addExperiment: (experiment: Omit<ExperimentType, 'id'>) => Promise<string>;
  updateExperiment: (id: string, experiment: Partial<ExperimentType>) => Promise<void>;
  getExperiment: (id: string) => Promise<ExperimentType | undefined>;
  setCurrentExperiment: (id: string) => Promise<void>;
  completeStep: (experimentId: string, stepIndex: number) => Promise<void>;
  deleteExperiment: (id: string) => Promise<void>;
  loading: boolean;
}

const ExperimentContext = createContext<ExperimentContextType | undefined>(undefined);

export const ExperimentProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [experiments, setExperiments] = useState<ExperimentType[]>([]);
  const [currentExperiment, setCurrentExperimentState] = useState<ExperimentType | null>(null);
  const [loading, setLoading] = useState(true);

  // Load experiments on mount
  useEffect(() => {
    loadExperiments();
  }, []);

  async function loadExperiments() {
    try {
      const { data: experiments, error } = await supabase
        .from('experiments')
        .select(`
          *,
          experiment_steps (*)
        `)
        .order('created_at', { ascending: false });

      if (error) throw error;

      setExperiments(experiments || []);
    } catch (error: any) {
      toast.error('Failed to load experiments');
      console.error('Error loading experiments:', error);
    } finally {
      setLoading(false);
    }
  }

  const addExperiment = async (experiment: Omit<ExperimentType, 'id'>): Promise<string> => {
    try {
      const { data, error } = await supabase
        .from('experiments')
        .insert([{
          title: experiment.title,
          description: experiment.description,
          protocol_file: experiment.protocolFile,
          progress: 0
        }])
        .select()
        .single();

      if (error) throw error;

      const experimentId = data.id;

      // Insert steps
      const { error: stepsError } = await supabase
        .from('experiment_steps')
        .insert(
          experiment.steps.map(step => ({
            experiment_id: experimentId,
            description: step.description,
            estimated_duration: step.estimatedDuration,
            scheduled_time: step.scheduledTime
          }))
        );

      if (stepsError) throw stepsError;

      await loadExperiments();
      return experimentId;
    } catch (error: any) {
      toast.error('Failed to create experiment');
      throw error;
    }
  };

  const updateExperiment = async (id: string, experimentUpdates: Partial<ExperimentType>) => {
    try {
      const { error } = await supabase
        .from('experiments')
        .update(experimentUpdates)
        .eq('id', id);

      if (error) throw error;

      await loadExperiments();
    } catch (error: any) {
      toast.error('Failed to update experiment');
      throw error;
    }
  };

  const getExperiment = async (id: string) => {
    try {
      const { data, error } = await supabase
        .from('experiments')
        .select(`
          *,
          experiment_steps (*)
        `)
        .eq('id', id)
        .single();

      if (error) throw error;
      return data;
    } catch (error: any) {
      toast.error('Failed to load experiment');
      throw error;
    }
  };

  const setCurrentExperiment = async (id: string) => {
    const experiment = await getExperiment(id);
    if (experiment) {
      setCurrentExperimentState(experiment);
    }
  };

  const completeStep = async (experimentId: string, stepIndex: number) => {
    try {
      const experiment = await getExperiment(experimentId);
      if (!experiment) throw new Error('Experiment not found');

      const step = experiment.experiment_steps[stepIndex];
      if (!step) throw new Error('Step not found');

      // Update step
      const { error: stepError } = await supabase
        .from('experiment_steps')
        .update({
          completed: true,
          completed_at: new Date().toISOString()
        })
        .eq('id', step.id);

      if (stepError) throw stepError;

      // Update experiment progress
      const completedSteps = experiment.experiment_steps.filter(s => s.completed).length + 1;
      const progress = Math.round((completedSteps / experiment.experiment_steps.length) * 100);

      const { error: experimentError } = await supabase
        .from('experiments')
        .update({ progress })
        .eq('id', experimentId);

      if (experimentError) throw experimentError;

      await loadExperiments();
    } catch (error: any) {
      toast.error('Failed to complete step');
      throw error;
    }
  };

  const deleteExperiment = async (id: string) => {
    try {
      const { error } = await supabase
        .from('experiments')
        .delete()
        .eq('id', id);

      if (error) throw error;

      await loadExperiments();
      if (currentExperiment?.id === id) {
        setCurrentExperimentState(null);
      }
    } catch (error: any) {
      toast.error('Failed to delete experiment');
      throw error;
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
        loading
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