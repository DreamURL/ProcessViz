import React, { useState, useEffect, useCallback } from 'react';
import { ProcessStep, UserSettings, StepResult } from '../types';
import { generateImageForStep, generateAudioScript } from '../services/geminiService';
import Spinner from './common/Spinner';
import Button from './common/Button';

interface GenerationScreenProps {
  apiKey: string;
  steps: ProcessStep[];
  settings: UserSettings;
  onComplete: (results: StepResult[]) => void;
}

const GenerationScreen: React.FC<GenerationScreenProps> = ({ apiKey, steps, settings, onComplete }) => {
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [completed, setCompleted] = useState<StepResult[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [currentResult, setCurrentResult] = useState<{ imageBase64: string, audioScript: string } | null>(null);

  const totalSteps = steps.length;
  const progress = totalSteps > 0 ? ((currentStepIndex) / totalSteps) * 100 : 0;

  const generateStep = useCallback(async (stepIndex: number) => {
    setIsLoading(true);
    setError(null);
    setCurrentResult(null);

    const currentStep = steps[stepIndex];
    const previousImage = completed.length > 0 ? completed[completed.length - 1].imageBase64 : null;
    
    try {
      const [imageBase64, audioScript] = await Promise.all([
        generateImageForStep(apiKey, currentStep, settings.visualizationStyle, previousImage),
        generateAudioScript(apiKey, currentStep)
      ]);
      
      setCurrentResult({ imageBase64, audioScript });
    } catch (err) {
      console.error(err);
      setError('An error occurred during generation for this step. You can try again.');
    } finally {
      setIsLoading(false);
    }
  }, [apiKey, steps, settings.visualizationStyle, completed]);
  
  useEffect(() => {
    if (steps.length > 0) {
      generateStep(0);
    }
     // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [steps]);

  const handleApprove = () => {
    if (!currentResult) return;

    const newResult: StepResult = {
      step: steps[currentStepIndex],
      ...currentResult
    };

    const updatedCompleted = [...completed, newResult];
    setCompleted(updatedCompleted);

    if (currentStepIndex < totalSteps - 1) {
      const nextStepIndex = currentStepIndex + 1;
      setCurrentStepIndex(nextStepIndex);
      generateStep(nextStepIndex);
    } else {
      onComplete(updatedCompleted);
    }
  };
  
  const handleRegenerate = () => {
    generateStep(currentStepIndex);
  };

  const currentStep = steps[currentStepIndex];

  return (
    <div className="max-w-6xl mx-auto">
      <div className="text-center mb-4">
        <h2 className="text-3xl font-bold">Generating Visuals: Step {currentStepIndex + 1} of {totalSteps}</h2>
        <p className="text-lg text-gray-400 mt-1">{currentStep?.title}</p>
      </div>
      
      {/* Progress Bar */}
      <div className="w-full bg-gray-700 rounded-full h-4 mb-8">
        <div className="bg-brand-secondary h-4 rounded-full transition-all duration-500" style={{ width: `${progress}%` }}></div>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 bg-gray-800/50 p-6 rounded-lg border border-gray-700 min-h-[400px] flex items-center justify-center">
            {isLoading && <Spinner text="Generating, please wait..." />}
            {!isLoading && error && <div className="text-center text-red-400">{error}</div>}
            {!isLoading && currentResult && (
                <img src={`data:image/png;base64,${currentResult.imageBase64}`} alt={`Visualization for ${currentStep.title}`} className="rounded-md object-contain max-h-full max-w-full" />
            )}
        </div>
        <div className="bg-gray-800/50 p-6 rounded-lg border border-gray-700 flex flex-col justify-between">
            <div>
                <h4 className="text-xl font-bold text-brand-accent mb-2">Step Description</h4>
                <p className="text-gray-300 mb-6">{currentStep?.description}</p>
                <h4 className="text-xl font-bold text-brand-accent mb-2">Generated Audio Script</h4>
                {isLoading ? <p className="text-gray-400 italic">Generating script...</p> : 
                    <p className="text-gray-300 bg-gray-700 p-3 rounded-md italic">"{currentResult?.audioScript || 'Script will appear here.'}"</p>
                }
            </div>
            <div className="mt-6 space-y-3">
                <Button onClick={handleApprove} isLoading={isLoading} disabled={!currentResult || isLoading}>Approve & Continue</Button>
                <Button onClick={handleRegenerate} variant="secondary" isLoading={isLoading} disabled={isLoading}>Regenerate</Button>
            </div>
        </div>
      </div>
    </div>
  );
};

export default GenerationScreen;