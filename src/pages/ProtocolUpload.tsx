import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Upload, AlertCircle, FilePlus, ArrowRight } from 'lucide-react';
import { useExperiments } from '../contexts/ExperimentContext';
import { extractProtocolSteps } from '../services/openai';
import { ExtractedProtocol } from '../types';

const ProtocolUpload: React.FC = () => {
  const navigate = useNavigate();
  const { addExperiment } = useExperiments();
  
  const [file, setFile] = useState<File | null>(null);
  const [fileContent, setFileContent] = useState<string>('');
  const [extractedProtocol, setExtractedProtocol] = useState<ExtractedProtocol | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0] || null;
    setFile(selectedFile);
    setError(null);
    
    if (selectedFile) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const content = event.target?.result as string;
        setFileContent(content);
      };
      reader.onerror = () => {
        setError('Failed to read file');
      };
      reader.readAsText(selectedFile);
    } else {
      setFileContent('');
    }
  };
  
  const handleManualInput = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setFileContent(e.target.value);
    setError(null);
  };
  
  const handleExtract = async () => {
    try {
      setIsLoading(true);
      setError(null);
      
      if (!fileContent.trim()) {
        throw new Error('Please upload a file or enter protocol text manually');
      }
      
      const extracted = await extractProtocolSteps(fileContent);
      setExtractedProtocol(extracted);
    } catch (err: any) {
      setError(err.message || 'Failed to extract protocol steps');
      setExtractedProtocol(null);
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleCreateExperiment = () => {
    if (!extractedProtocol) return;
    
    const newExperiment = {
      id: crypto.randomUUID(),
      title: extractedProtocol.title,
      description: extractedProtocol.description,
      steps: extractedProtocol.steps.map((step) => ({
        description: step.description,
        estimatedDuration: step.estimatedDuration,
        completed: false,
        scheduledTime: new Date().toISOString(), // This would be calculated based on the experiment start time and step durations
      })),
      uploadedAt: new Date().toISOString(),
      progress: 0,
      protocolFile: fileContent,
    };
    
    addExperiment(newExperiment);
    navigate(`/experiments/${newExperiment.id}`);
  };
  
  return (
    <div className="max-w-3xl mx-auto">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Upload Experiment Protocol</h1>
        <p className="mt-2 text-gray-600">
          Upload your protocol document or paste the content below to extract experimental steps.
        </p>
      </div>
      
      <div className="space-y-6">
        {/* File Upload */}
        <div className="rounded-lg border border-dashed border-gray-300 p-6">
          <div className="flex flex-col items-center justify-center">
            <Upload className="mb-4 h-12 w-12 text-gray-400" />
            <h3 className="text-lg font-medium text-gray-900">Upload Protocol Document</h3>
            <p className="mt-1 text-sm text-gray-500">
              Drag and drop your protocol document or click to browse
            </p>
            
            <label
              htmlFor="file-upload"
              className="mt-4 cursor-pointer rounded-md bg-primary-600 px-4 py-2 text-sm font-medium text-white hover:bg-primary-700"
            >
              <span>Select File</span>
              <input
                id="file-upload"
                name="file-upload"
                type="file"
                className="sr-only"
                accept=".txt,.doc,.docx,.pdf"
                onChange={handleFileChange}
              />
            </label>
            
            {file && (
              <div className="mt-4 text-sm text-gray-500">
                Selected file: <span className="font-medium">{file.name}</span>
              </div>
            )}
          </div>
        </div>
        
        {/* Manual Input */}
        <div>
          <h3 className="mb-2 text-lg font-medium text-gray-900">Or Enter Protocol Manually</h3>
          <textarea
            className="w-full rounded-md border border-gray-300 px-4 py-3 focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500"
            rows={10}
            placeholder="Paste your protocol here..."
            value={fileContent}
            onChange={handleManualInput}
          ></textarea>
        </div>
        
        {/* Extract Button */}
        <div className="flex justify-center">
          <button
            type="button"
            className="btn btn-primary px-6"
            onClick={handleExtract}
            disabled={isLoading || !fileContent.trim()}
          >
            {isLoading ? (
              <>
                <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent"></div>
                Processing...
              </>
            ) : (
              <>
                <FilePlus className="mr-2 h-5 w-5" />
                Extract Protocol Steps
              </>
            )}
          </button>
        </div>
        
        {/* Error Message */}
        {error && (
          <div className="rounded-md bg-red-50 p-4">
            <div className="flex">
              <AlertCircle className="h-5 w-5 text-red-400" />
              <div className="ml-3">
                <h3 className="text-sm font-medium text-red-800">Error</h3>
                <div className="mt-2 text-sm text-red-700">{error}</div>
              </div>
            </div>
          </div>
        )}
        
        {/* Extracted Protocol Preview */}
        {extractedProtocol && (
          <div className="mt-8 rounded-md border border-gray-200 bg-white p-6">
            <h3 className="text-lg font-medium text-gray-900">Extracted Protocol</h3>
            
            <div className="mt-4">
              <div className="mb-4">
                <h4 className="text-sm font-medium text-gray-500">Title</h4>
                <p className="text-gray-900">{extractedProtocol.title}</p>
              </div>
              
              <div className="mb-4">
                <h4 className="text-sm font-medium text-gray-500">Description</h4>
                <p className="text-gray-900">{extractedProtocol.description}</p>
              </div>
              
              <div>
                <h4 className="mb-2 text-sm font-medium text-gray-500">Steps</h4>
                <ul className="space-y-2">
                  {extractedProtocol.steps.map((step, index) => (
                    <li key={index} className="flex items-start rounded-md border border-gray-200 p-3">
                      <div className="mr-3 flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full bg-primary-100 text-primary-800">
                        {index + 1}
                      </div>
                      <div>
                        <p className="text-gray-900">{step.description}</p>
                        {step.estimatedDuration && (
                          <p className="mt-1 text-sm text-gray-500">
                            Estimated duration: {step.estimatedDuration} minutes
                          </p>
                        )}
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
              
              <div className="mt-6 flex justify-end">
                <button
                  type="button"
                  className="btn btn-primary"
                  onClick={handleCreateExperiment}
                >
                  Create Experiment
                  <ArrowRight className="ml-2 h-4 w-4" />
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProtocolUpload;