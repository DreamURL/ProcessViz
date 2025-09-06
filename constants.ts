
import { Complexity, VisualizationStyle } from './types';

export const COMPLEXITY_LEVELS = Object.values(Complexity);
export const VISUALIZATION_STYLES = Object.values(VisualizationStyle);

export const STYLE_DESCRIPTIONS: Record<VisualizationStyle, string> = {
    [VisualizationStyle.CAD]: 'Precise 2D technical drawings with clean lines and standard symbols.',
    [VisualizationStyle.SCHEMATIC]: 'Clear, intuitive diagrams emphasizing process flow and equipment labeling.',
    [VisualizationStyle.REALISTIC]: 'High-quality 3D renderings with realistic textures, lighting, and depth.',
};

export const COMPLEXITY_STEPS: Record<Complexity, string> = {
    [Complexity.SIMPLE]: '3-5 steps',
    [Complexity.STANDARD]: '5-7 steps',
    [Complexity.COMPLEX]: '7-10 steps',
};

export const PROMPT_TEMPLATES: Record<VisualizationStyle, string> = {
  [VisualizationStyle.CAD]: `Generate a highly detailed and precise 2D technical CAD drawing for a process step: "{step_description}". 
- Use standard CAD symbols and orthographic projection.
- Ensure clean line work and precise proportional relationships.
- Include measurable dimensions and technical annotations where appropriate.
- Maintain a consistent visual style with any previous diagrams.
- Use the following color code: input materials are blue, final products are green, and utilities (like water, steam) are gray.
- Ensure pipes and equipment connections are logical and continuous from any previous step.`,

  [VisualizationStyle.SCHEMATIC]: `Create a clear and easy-to-understand schematic process flow diagram for: "{step_description}".
- Emphasize intuitive iconography and clear process flow indicators (arrows).
- Label all major equipment with clear, legible text.
- The diagram should be educational and documentation-friendly.
- Maintain visual consistency with any previous diagrams.
- Adhere to this color coding: input materials are represented in blue, final products in green, and utilities in gray.
- Make sure all material flows (pipes, conveyors) connect logically to components from a previous step.`,

  [VisualizationStyle.REALISTIC]: `Render a photorealistic 3D industrial scene visualizing the process step: "{step_description}".
- The visualization must be industrial-grade with realistic material textures (e.g., stainless steel, concrete, plastic).
- Use professional lighting to create spatial depth and a sense of realism.
- The output should be marketing and presentation-ready quality.
- Maintain scale, proportion, and visual continuity with any previously generated images.
- Apply a color system: primary input materials should be colored blue, final products green, and general utilities/structures gray.
- All connections to equipment from a previous step must be seamless and logical.`,
};
