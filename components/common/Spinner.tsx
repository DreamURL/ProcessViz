
import React from 'react';

interface SpinnerProps {
    size?: 'sm' | 'md' | 'lg';
    text?: string;
}

const Spinner: React.FC<SpinnerProps> = ({ size = 'md', text }) => {
    const sizeClasses = {
        sm: 'h-8 w-8',
        md: 'h-16 w-16',
        lg: 'h-24 w-24',
    };
    return (
        <div className="flex flex-col items-center justify-center gap-4 p-8">
            <div className={`animate-spin rounded-full border-4 border-gray-600 border-t-brand-secondary ${sizeClasses[size]}`}></div>
            {text && <p className="text-lg text-gray-300 animate-pulse">{text}</p>}
        </div>
    );
};

export default Spinner;
