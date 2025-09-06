import React, { useState } from 'react';
import Button from './Button';

interface ApiKeyManagerProps {
    onKeySubmit: (key: string) => void;
}

const ApiKeyManager: React.FC<ApiKeyManagerProps> = ({ onKeySubmit }) => {
    const [key, setKey] = useState('');

    const handleSubmit = () => {
        if (key.trim()) {
            onKeySubmit(key.trim());
        }
    };
    
    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter') {
            handleSubmit();
        }
    }

    return (
        <div className="flex items-center gap-2">
            <input 
                type="password" 
                placeholder="Enter Gemini API Key" 
                value={key} 
                onChange={(e) => setKey(e.target.value)}
                onKeyDown={handleKeyDown}
                className="bg-gray-700 border border-gray-600 rounded-md shadow-sm focus:ring-brand-accent focus:border-brand-accent sm:text-sm p-2 w-64 text-white"
                aria-label="Gemini API Key"
            />
            <Button 
                onClick={handleSubmit} 
                disabled={!key.trim()}
                className="py-2 px-4 !text-sm"
            >
                Save Key
            </Button>
        </div>
    );
};

export default ApiKeyManager;
