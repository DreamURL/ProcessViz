
import React, { useState, useEffect } from 'react';
import { ProcessStep } from '../types';
import Button from './common/Button';

interface StepEditorProps {
  initialSteps: ProcessStep[];
  onConfirm: (steps: ProcessStep[]) => void;
}

const StepEditor: React.FC<StepEditorProps> = ({ initialSteps, onConfirm }) => {
  const [steps, setSteps] = useState<ProcessStep[]>(initialSteps);

  useEffect(() => {
    setSteps(initialSteps);
  }, [initialSteps]);

  const handleStepChange = (index: number, field: 'title' | 'description', value: string) => {
    const newSteps = [...steps];
    newSteps[index] = { ...newSteps[index], [field]: value };
    setSteps(newSteps);
  };

  const addStep = (index: number) => {
    const newSteps = [...steps];
    newSteps.splice(index + 1, 0, { id: `new-step-${Date.now()}`, title: 'New Step', description: 'Detailed description of the new step.' });
    setSteps(newSteps);
  };

  const removeStep = (index: number) => {
    const newSteps = steps.filter((_, i) => i !== index);
    setSteps(newSteps);
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="text-center mb-8">
        <h2 className="text-4xl font-extrabold text-white">Review and Edit Process Steps</h2>
        <p className="mt-2 text-lg text-gray-400">
          The AI has broken down your process into the following steps. Review, edit, add, or remove steps as needed.
        </p>
      </div>

      <div className="space-y-6 bg-gray-800/50 p-8 rounded-lg shadow-2xl border border-gray-700">
        {steps.map((step, index) => (
          <div key={step.id} className="bg-gray-700 p-4 rounded-lg border border-gray-600 transition-shadow hover:shadow-lg">
            <div className="flex justify-between items-center mb-2">
                <h3 className="text-xl font-bold text-brand-accent">Step {index + 1}</h3>
                <div className="flex items-center gap-2">
                    <button onClick={() => addStep(index)} className="p-1 text-gray-400 hover:text-green-400" title="Add step after this">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z" clipRule="evenodd" /></svg>
                    </button>
                    <button onClick={() => removeStep(index)} className="p-1 text-gray-400 hover:text-red-400" title="Remove this step">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M5 10a1 1 0 011-1h8a1 1 0 110 2H6a1 1 0 01-1-1z" clipRule="evenodd" /></svg>
                    </button>
                </div>
            </div>
            <div className="space-y-3">
              <input
                type="text"
                value={step.title}
                onChange={(e) => handleStepChange(index, 'title', e.target.value)}
                className="w-full bg-gray-600 p-2 rounded-md text-white font-semibold"
              />
              <textarea
                value={step.description}
                onChange={(e) => handleStepChange(index, 'description', e.target.value)}
                rows={3}
                className="w-full bg-gray-600 p-2 rounded-md text-gray-300"
              />
            </div>
          </div>
        ))}
      </div>
      
      <div className="mt-8 flex justify-end">
        <Button onClick={() => onConfirm(steps)} disabled={steps.length === 0}>
          Confirm Steps & Start Generation
        </Button>
      </div>
    </div>
  );
};

export default StepEditor;
