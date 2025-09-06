
import React from 'react';
import { StepResult, UserSettings } from '../types';
import Button from './common/Button';

interface ResultsDashboardProps {
  results: StepResult[];
  onRestart: () => void;
  settings: UserSettings | null;
}

const ResultsDashboard: React.FC<ResultsDashboardProps> = ({ results, onRestart, settings }) => {
    
  const downloadImage = (base64Image: string, fileName: string) => {
    const link = document.createElement('a');
    link.href = `data:image/png;base64,${base64Image}`;
    link.download = `${fileName.replace(/\s+/g, '_')}.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };
    
  return (
    <div className="max-w-6xl mx-auto">
      <div className="text-center mb-8">
        <h2 className="text-4xl font-extrabold text-white">Generation Complete!</h2>
        <p className="mt-2 text-lg text-gray-400">
          Project: <span className="font-semibold text-white">{settings?.projectTitle}</span>
        </p>
      </div>

      <div className="space-y-8">
        {results.map((result, index) => (
          <div key={result.step.id} className="bg-gray-800/50 p-6 rounded-lg shadow-2xl border border-gray-700 grid grid-cols-1 md:grid-cols-5 gap-6">
            <div className="md:col-span-3">
              <img src={`data:image/png;base64,${result.imageBase64}`} alt={result.step.title} className="rounded-md w-full" />
            </div>
            <div className="md:col-span-2">
              <h3 className="text-2xl font-bold text-brand-accent mb-2">Step {index + 1}: {result.step.title}</h3>
              <p className="text-gray-300 mb-4">{result.step.description}</p>
              <div className="bg-gray-700 p-4 rounded-md">
                <h4 className="font-semibold text-gray-200 mb-1">Narration Script</h4>
                <p className="text-gray-400 italic">"{result.audioScript}"</p>
              </div>
              <Button 
                className="mt-4 w-full" 
                variant="secondary"
                onClick={() => downloadImage(result.imageBase64, `step_${index+1}_${result.step.title}`)}
              >
                Download Image
              </Button>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-12 text-center">
        <Button onClick={onRestart}>Create Another Process</Button>
      </div>
    </div>
  );
};

export default ResultsDashboard;
