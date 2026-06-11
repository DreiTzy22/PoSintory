import { useState, useEffect } from 'react';

export function useTheme() {
    // Initialize state
    const [isDark, setIsDark] = useState(false);

    // Mount effect: read from storage and initialize DOM
    useEffect(() => {
        // Read from localStorage
        const savedTheme = localStorage.getItem('theme');
        let initialDark = false;
        
        if (savedTheme) {
            initialDark = savedTheme === 'dark';
        } else if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
            initialDark = true;
        }
        
        setIsDark(initialDark);

        // Listen for storage changes from other tabs
        const handleStorage = (e) => {
            if (e.key === 'theme') {
                setIsDark(e.newValue === 'dark');
            }
        };
        window.addEventListener('storage', handleStorage);
        return () => window.removeEventListener('storage', handleStorage);
    }, []);

    // Update DOM and storage when isDark changes
    useEffect(() => {
        console.log('useTheme: isDark changed to', isDark);
        if (isDark) {
            document.documentElement.classList.add('dark');
            localStorage.setItem('theme', 'dark');
        } else {
            document.documentElement.classList.remove('dark');
            localStorage.setItem('theme', 'light');
        }
    }, [isDark]);

    const toggleDark = () => {
        console.log('useTheme: toggleDark called');
        setIsDark(prev => !prev);
    };

    return { isDark, toggleDark };
}
