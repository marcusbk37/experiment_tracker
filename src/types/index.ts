export interface ExperimentStep {
  description: string;
  scheduledTime?: string; // ISO string
  estimatedDuration?: number; // in minutes
  completed: boolean;
  completedAt?: string; // ISO string
}

export interface ExperimentType {
  id: string;
  title: string;
  description: string;
  steps: ExperimentStep[];
  uploadedAt: string; // ISO string
  startedAt?: string; // ISO string
  completedAt?: string; // ISO string
  progress: number; // 0-100
  protocolFile?: string; // Original protocol content
}

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
}

export interface ExtractedProtocol {
  title: string;
  description: string;
  steps: {
    description: string;
    estimatedDuration?: number;
  }[];
}