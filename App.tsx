import React, { useState, useCallback } from 'react';
import { AppState, UserSettings, ProcessStep, StepResult, InputMethod } from './types';
import LandingPage from './components/LandingPage';
import StepEditor from './components/StepEditor';
import GenerationScreen from './components/GenerationScreen';
import ResultsDashboard from './components/ResultsDashboard';
import UserManual from './components/UserManual';
import { LogoIcon } from './components/icons/LogoIcon';
import { HelpIcon } from './components/icons/HelpIcon';
import { CheckIcon } from './components/icons/CheckIcon';
import ApiKeyManager from './components/common/ApiKeyManager';
import { decomposeProcessIntoSteps } from './services/geminiService';

const App: React.FC = () => {
  const [appState, setAppState] = useState<AppState>(AppState.CONFIG);
  const [userSettings, setUserSettings] = useState<UserSettings | null>(null);
  const [processSteps, setProcessSteps] = useState<ProcessStep[]>([]);
  const [completedSteps, setCompletedSteps] = useState<StepResult[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [showManual, setShowManual] = useState<boolean>(false);
  const [apiKey, setApiKey] = useState('');

  const handleApiKeySubmit = (key: string) => {
    setApiKey(key);
  };

  const handleConfigSubmit = useCallback(async (settings: UserSettings) => {
    if (!apiKey) {
      setError('Please enter and save your Gemini API Key in the header before proceeding.');
      return;
    }
    setIsLoading(true);
    setError(null);
    setUserSettings(settings);
    try {
      const inputText = settings.inputMethod === InputMethod.TEXT ? settings.inputText : "Process described in the provided image";
      const steps = await decomposeProcessIntoSteps(apiKey, inputText, settings.inputImage, settings.complexity);
      setProcessSteps(steps);
      setAppState(AppState.EDITING_STEPS);
    } catch (err) {
      setError('Failed to decompose the process. Please try again.');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  }, [apiKey]);

  const handleStepsConfirmed = useCallback((steps: ProcessStep[]) => {
    setProcessSteps(steps);
    setAppState(AppState.GENERATING);
  }, []);

  const handleGenerationComplete = useCallback((results: StepResult[]) => {
    setCompletedSteps(results);
    setAppState(AppState.RESULTS);
  }, []);

  const handleRestart = useCallback(() => {
    setAppState(AppState.CONFIG);
    setUserSettings(null);
    setProcessSteps([]);
    setCompletedSteps([]);
    setError(null);
  }, []);

  const renderContent = () => {
    switch (appState) {
      case AppState.CONFIG:
        return <LandingPage onSubmit={handleConfigSubmit} isLoading={isLoading} error={error} isApiKeySet={!!apiKey} />;
      case AppState.EDITING_STEPS:
        return <StepEditor initialSteps={processSteps} onConfirm={handleStepsConfirmed} />;
      case AppState.GENERATING:
        if (!userSettings) return null;
        return <GenerationScreen apiKey={apiKey} steps={processSteps} settings={userSettings} onComplete={handleGenerationComplete} />;
      case AppState.RESULTS:
        return <ResultsDashboard results={completedSteps} onRestart={handleRestart} settings={userSettings} />;
      default:
        return <LandingPage onSubmit={handleConfigSubmit} isLoading={isLoading} error={error} isApiKeySet={!!apiKey} />;
    }
  };

  return (
    <div className="min-h-screen bg-brand-dark flex flex-col font-sans">
       {showManual && <UserManual onClose={() => setShowManual(false)} />}
      <header className="bg-gray-900/80 backdrop-blur-sm p-4 border-b border-gray-700 sticky top-0 z-10">
        <div className="container mx-auto flex justify-between items-center">
          <div className="flex items-center gap-3">
            <LogoIcon className="h-10 w-10 text-brand-secondary" />
            <h1 className="text-2xl font-bold text-gray-100">ProcessViz AI</h1>
          </div>
          <div className="flex items-center gap-4">
            {appState === AppState.CONFIG && !apiKey && (
              <ApiKeyManager onKeySubmit={handleApiKeySubmit} />
            )}
            {appState === AppState.CONFIG && apiKey && (
              <div className="flex items-center gap-2 text-green-400">
                <CheckIcon className="h-6 w-6" />
                <span className="text-sm font-medium">API Key Provided</span>
                <button 
                  onClick={() => setApiKey('')} 
                  className="text-gray-400 hover:text-white text-xs ml-1 p-1 rounded-full hover:bg-gray-700"
                  aria-label="Change API Key"
                >
                  (Change)
                </button>
              </div>
            )}
            <button 
              onClick={() => setShowManual(true)} 
              className="flex items-center gap-2 text-gray-300 hover:text-brand-accent transition-colors"
              aria-label="Show user manual"
            >
              <HelpIcon className="h-6 w-6" />
              <span className="hidden sm:inline">How to Use</span>
            </button>
          </div>
        </div>
      </header>
      <main className="flex-grow container mx-auto p-4 md:p-8">
        {renderContent()}
      </main>
      <footer className="bg-gray-900 text-center p-4 border-t border-gray-700">
        <p className="text-gray-500 text-sm">&copy; {new Date().getFullYear()} ProcessViz AI. Generated by Gemini AI Studio.</p>
      </footer>
    </div>
  );
};

export default App;