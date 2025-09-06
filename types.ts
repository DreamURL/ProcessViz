export enum InputMethod { TEXT = 'text', IMAGE = 'image' }
export enum Complexity { SIMPLE = 'Simple', STANDARD = 'Standard', COMPLEX = 'Complex' }
export enum VisualizationStyle { CAD = 'CAD', SCHEMATIC = 'Schematic', REALISTIC = 'Photorealistic 3D' }

export interface UserSettings {
  projectTitle: string;
  projectDescription: string;
  inputMethod: InputMethod;
  inputText: string;
  // FIX: Use the ImageFile interface for inputImage to ensure it includes the 'name' property.
  inputImage: ImageFile | null;
  complexity: Complexity;
  visualizationStyle: VisualizationStyle;
}

export interface ProcessStep {
  id: string;
  title: string;
  description: string;
}

export interface StepResult {
  step: ProcessStep;
  imageBase64: string;
  audioScript: string;
}

export enum AppState {
  CONFIG,
  EDITING_STEPS,
  GENERATING,
  RESULTS,
}

export interface ImageFile {
  base64: string;
  mimeType: string;
  name: string;
}
