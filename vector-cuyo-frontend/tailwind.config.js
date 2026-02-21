
/** @type {import('tailwindcss').Config} */
export default {
    darkMode: 'class',
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            colors: {
                primary: "var(--color-primary)",
                "off-white": "var(--color-off-white)",
                "surface": "var(--color-surface)",
                "gray-border": "var(--color-gray-border)",
                "text-main": "var(--color-text-main)",
                "text-secondary": "var(--color-text-secondary)",
                "muted": "var(--color-muted)",
                "blue-tint": "var(--color-blue-tint)",
                "success": "var(--color-success)",
                "warning": "var(--color-warning)",
                "danger": "var(--color-danger)",
            },
            fontFamily: {
                sans: ["Inter", "sans-serif"],
            },
            borderRadius: {
                "card": "12px",
                "pill": "9999px",
            },
            spacing: {
                '18': '4.5rem',
                'header': '64px',
            },
            backgroundImage: {
                'dtf-texture': "url('https://images.unsplash.com/photo-1503342217505-b0a15ec3261c?q=80&w=2070&auto=format&fit=crop')",
            }
        },
    },
    plugins: [],
}
