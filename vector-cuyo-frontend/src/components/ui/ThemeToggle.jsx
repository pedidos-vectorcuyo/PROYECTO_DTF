
import React from 'react';
import { useTheme } from '../context/ThemeContext';

const ThemeToggle = () => {
    const { isDarkMode, toggleTheme } = useTheme();

    return (
        <button
            onClick={toggleTheme}
            className="relative flex items-center justify-between w-14 h-7 p-1 rounded-full bg-muted border border-gray-border transition-colors duration-300 focus:outline-none"
            aria-label="Toggle Dark Mode"
        >
            <div
                className={`flex items-center justify-center w-5 h-5 rounded-full bg-white shadow-sm transform transition-transform duration-300 ${isDarkMode ? 'translate-x-7' : 'translate-x-0'
                    }`}
            >
                <span className="material-symbols-outlined text-[14px] text-primary">
                    {isDarkMode ? 'dark_mode' : 'light_mode'}
                </span>
            </div>
            <div className="flex-1 flex justify-around items-center px-1">
                {/* Decorative background icons */}
                {!isDarkMode && <span className="material-symbols-outlined text-[12px] text-text-secondary opacity-40">dark_mode</span>}
                {isDarkMode && <span className="material-symbols-outlined text-[12px] text-text-secondary opacity-40">light_mode</span>}
            </div>
        </button>
    );
};

export default ThemeToggle;
