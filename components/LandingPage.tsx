import React, { useState, useCallback, ChangeEvent, DragEvent } from 'react';
import { UserSettings, InputMethod, Complexity, VisualizationStyle, ImageFile } from '../types';
import { COMPLEXITY_LEVELS, VISUALIZATION_STYLES, STYLE_DESCRIPTIONS, COMPLEXITY_STEPS } from '../constants';
import Button from './common/Button';

interface LandingPageProps {
  onSubmit: (settings: UserSettings) => void;
  isLoading: boolean;
  error: string | null;
  isApiKeySet: boolean;
}

const LandingPage: React.FC<LandingPageProps> = ({ onSubmit, isLoading, error, isApiKeySet }) => {
  const [settings, setSettings] = useState<UserSettings>({
    projectTitle: '',
    projectDescription: '',
    inputMethod: InputMethod.TEXT,
    inputText: '',
    inputImage: null,
    complexity: Complexity.STANDARD,
    visualizationStyle: VisualizationStyle.SCHEMATIC,
  });
  const [isDragging, setIsDragging] = useState(false);

  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setSettings(prev => ({ ...prev, [name]: value }));
  };
  
  const handleFileChange = (file: File | null) => {
    if (file && file.type.startsWith('image/')) {
        const reader = new FileReader();
        reader.onloadend = () => {
            setSettings(prev => ({
                ...prev,
                inputImage: {
                    base64: (reader.result as string).split(',')[1],
                    mimeType: file.type,
                    name: file.name
                }
            }));
        };
        reader.readAsDataURL(file);
    }
  };
  
  const onFileSelected = (e: ChangeEvent<HTMLInputElement>) => {
    handleFileChange(e.target.files ? e.target.files[0] : null);
  };
  
  const handleDrop = useCallback((e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    handleFileChange(e.dataTransfer.files ? e.dataTransfer.files[0] : null);
  }, []);

  const handleDragOver = useCallback((e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (isApiKeySet) {
      onSubmit(settings);
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="text-center mb-8">
        <h2 className="text-4xl font-extrabold text-white">Create Your Process Diagram</h2>
        <p className="mt-2 text-lg text-gray-400">
          Turn complex industrial processes into clear visual diagrams with AI.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8 p-8 bg-gray-800/50 rounded-lg shadow-2xl border border-gray-700">
        
        {/* Section 1: Project Details */}
        <section>
          <h3 className="text-2xl font-bold mb-4 border-b-2 border-brand-accent pb-2">1. Project Details</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label htmlFor="projectTitle" className="block text-sm font-medium text-gray-300">Project Title</label>
              <input type="text" name="projectTitle" id="projectTitle" value={settings.projectTitle} onChange={handleChange} required className="mt-1 block w-full bg-gray-700 border-gray-600 rounded-md shadow-sm focus:ring-brand-accent focus:border-brand-accent sm:text-sm p-3"/>
            </div>
            <div>
              <label htmlFor="projectDescription" className="block text-sm font-medium text-gray-300">Brief Description</label>
              <input type="text" name="projectDescription" id="projectDescription" value={settings.projectDescription} onChange={handleChange} required className="mt-1 block w-full bg-gray-700 border-gray-600 rounded-md shadow-sm focus:ring-brand-accent focus:border-brand-accent sm:text-sm p-3"/>
            </div>
          </div>
        </section>

        {/* Section 2: Input Method */}
        <section>
          <h3 className="text-2xl font-bold mb-4 border-b-2 border-brand-accent pb-2">2. Input Method</h3>
          <div className="flex rounded-lg bg-gray-700 p-1">
            <button type="button" onClick={() => setSettings(s => ({ ...s, inputMethod: InputMethod.TEXT }))} className={`w-full p-2 rounded-md transition-colors ${settings.inputMethod === InputMethod.TEXT ? 'bg-brand-secondary text-white' : 'hover:bg-gray-600'}`}>Text-based</button>
            <button type="button" onClick={() => setSettings(s => ({ ...s, inputMethod: InputMethod.IMAGE }))} className={`w-full p-2 rounded-md transition-colors ${settings.inputMethod === InputMethod.IMAGE ? 'bg-brand-secondary text-white' : 'hover:bg-gray-600'}`}>Image-based</button>
          </div>
          <div className="mt-4">
            {settings.inputMethod === InputMethod.TEXT ? (
              <textarea name="inputText" value={settings.inputText} onChange={handleChange} rows={6} placeholder="Describe the industrial process here, e.g., 'Municipal water treatment process starting from raw water intake...'" required className="block w-full bg-gray-700 border-gray-600 rounded-md shadow-sm focus:ring-brand-accent focus:border-brand-accent sm:text-sm p-3"></textarea>
            ) : (
              <div onDrop={handleDrop} onDragOver={handleDragOver} onDragLeave={handleDragLeave} className={`mt-1 flex justify-center px-6 pt-5 pb-6 border-2 ${isDragging ? 'border-brand-accent' : 'border-gray-600'} border-dashed rounded-md`}>
                <div className="space-y-1 text-center">
                  <svg className="mx-auto h-12 w-12 text-gray-500" stroke="currentColor" fill="none" viewBox="0 0 48 48" aria-hidden="true"><path d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /></svg>
                  <div className="flex text-sm text-gray-400">
                    <label htmlFor="file-upload" className="relative cursor-pointer bg-gray-800 rounded-md font-medium text-brand-accent hover:text-brand-secondary focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-offset-gray-900 focus-within:ring-brand-accent px-1">
                      <span>Upload a file</span>
                      <input id="file-upload" name="file-upload" type="file" className="sr-only" onChange={onFileSelected} accept="image/*"/>
                    </label>
                    <p className="pl-1">or drag and drop</p>
                  </div>
                  <p className="text-xs text-gray-500">PNG, JPG, GIF up to 10MB</p>
                  {settings.inputImage && <p className="text-sm text-green-400 mt-2">{settings.inputImage.name} selected</p>}
                </div>
              </div>
            )}
          </div>
        </section>

        {/* Section 3: Configuration */}
        <section>
          <h3 className="text-2xl font-bold mb-4 border-b-2 border-brand-accent pb-2">3. Configuration</h3>
          <div className="space-y-6">
              <div>
                <label className="block text-lg font-medium text-gray-300">Process Complexity</label>
                <div className="mt-2 grid grid-cols-1 sm:grid-cols-3 gap-4">
                  {COMPLEXITY_LEVELS.map(level => (
                    <div key={level} onClick={() => setSettings(s => ({...s, complexity: level}))} className={`cursor-pointer p-4 rounded-lg border-2 transition-all ${settings.complexity === level ? 'bg-brand-secondary border-brand-accent shadow-lg' : 'bg-gray-700 border-gray-600 hover:border-brand-accent'}`}>
                      <h4 className="font-bold text-white">{level}</h4>
                      <p className="text-sm text-gray-300">{COMPLEXITY_STEPS[level]}</p>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-lg font-medium text-gray-300">Visualization Style</label>
                <div className="mt-2 grid grid-cols-1 sm:grid-cols-3 gap-4">
                  {VISUALIZATION_STYLES.map(style => (
                    <div key={style} onClick={() => setSettings(s => ({...s, visualizationStyle: style}))} className={`cursor-pointer p-4 rounded-lg border-2 transition-all ${settings.visualizationStyle === style ? 'bg-brand-secondary border-brand-accent shadow-lg' : 'bg-gray-700 border-gray-600 hover:border-brand-accent'}`}>
                      <h4 className="font-bold text-white">{style}</h4>
                      <p className="text-sm text-gray-300">{STYLE_DESCRIPTIONS[style]}</p>
                    </div>
                  ))}
                </div>
              </div>
          </div>
        </section>

        {error && <p className="text-red-400 bg-red-900/50 p-3 rounded-md">{error}</p>}
        
        <div className="flex justify-end pt-4">
          <Button type="submit" isLoading={isLoading} disabled={!isApiKeySet || isLoading}>
            {!isApiKeySet ? 'API Key Required' : (isLoading ? 'Analyzing Process...' : 'Decompose Process')}
          </Button>
        </div>
      </form>
    </div>
  );
};

export default LandingPage;