
import React from 'react';

interface UserManualProps {
    onClose: () => void;
}

const UserManual: React.FC<UserManualProps> = ({ onClose }) => {
    return (
        <div 
            className="fixed inset-0 bg-black bg-opacity-80 flex items-center justify-center z-50 p-4"
            onClick={onClose}
            role="dialog"
            aria-modal="true"
            aria-labelledby="manual-title"
        >
            <div 
                className="bg-gray-800 rounded-2xl shadow-2xl border border-gray-700 max-w-3xl w-full max-h-[90vh] overflow-y-auto p-8 text-gray-300 relative"
                onClick={e => e.stopPropagation()} // Prevent click from closing modal
            >
                <button 
                    onClick={onClose} 
                    className="absolute top-4 right-4 text-gray-500 hover:text-white transition-colors"
                    aria-label="Close user manual"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" /></svg>
                </button>
                
                <h2 id="manual-title" className="text-3xl font-extrabold text-white mb-6">How to Use ProcessViz AI</h2>
                
                <div className="space-y-6">
                    <section>
                        <h3 className="text-xl font-bold text-brand-accent mb-2">Step 1: Configure Your Project</h3>
                        <p>This is the starting point for your diagram generation. Fill out the form with the following details:</p>
                        <ul className="list-disc list-inside mt-2 space-y-1 pl-2">
                            <li><strong>Project Details:</strong> Give your project a title and a brief description.</li>
                            <li><strong>Input Method:</strong> Choose how you want to describe your process.
                                <ul className="list-disc list-inside mt-1 space-y-1 pl-6">
                                    <li><strong>Text-based:</strong> Write a detailed description of the process in the text area.</li>
                                    <li><strong>Image-based:</strong> Upload a sketch, a simple diagram, or a reference image of your process.</li>
                                </ul>
                            </li>
                            <li><strong>Process Complexity:</strong> Select how many steps the AI should break your process into (Simple, Standard, or Complex).</li>
                            <li><strong>Visualization Style:</strong> Choose the visual aesthetic for your diagrams (CAD, Schematic, or Photorealistic 3D).</li>
                        </ul>
                        <p className="mt-2">Once you're ready, click <strong>"Decompose Process"</strong>.</p>
                    </section>
                    
                    <section>
                        <h3 className="text-xl font-bold text-brand-accent mb-2">Step 2: Review and Edit Steps</h3>
                        <p>The AI will analyze your input and break it down into a sequence of steps. On this screen, you can:</p>
                        <ul className="list-disc list-inside mt-2 space-y-1 pl-2">
                            <li><strong>Edit:</strong> Modify the title or description of any step to be more accurate.</li>
                            <li><strong>Add:</strong> Click the plus icon to add a new step after an existing one.</li>
                            <li><strong>Remove:</strong> Click the minus icon to delete a step you don't need.</li>
                        </ul>
                        <p className="mt-2">When you are satisfied with the process flow, click <strong>"Confirm Steps & Start Generation"</strong>.</p>
                    </section>

                    <section>
                        <h3 className="text-xl font-bold text-brand-accent mb-2">Step 3: Supervise the Generation</h3>
                        <p>The application will now generate a visual diagram and a narration script for each step, one by one.</p>
                        <ul className="list-disc list-inside mt-2 space-y-1 pl-2">
                            <li>The generated image will appear on the left, and the script on the right.</li>
                            <li>If you are happy with the result, click <strong>"Approve & Continue"</strong> to proceed to the next step.</li>
                            <li>If the result isn't quite right, click <strong>"Regenerate"</strong> to have the AI try again for the current step.</li>
                        </ul>
                    </section>

                    <section>
                        <h3 className="text-xl font-bold text-brand-accent mb-2">Step 4: View and Download Results</h3>
                        <p>After all steps are generated and approved, you'll land on the results dashboard. Here you can:</p>
                         <ul className="list-disc list-inside mt-2 space-y-1 pl-2">
                            <li>View all your generated diagrams and their corresponding narration scripts together.</li>
                            <li>Download each image individually by clicking the <strong>"Download Image"</strong> button.</li>
                            <li>Start a new project by clicking <strong>"Create Another Process"</strong>.</li>
                        </ul>
                    </section>
                </div>
            </div>
        </div>
    );
};

export default UserManual;
