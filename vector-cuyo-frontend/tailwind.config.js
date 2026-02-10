
/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            colors: {
                primary: "#0072FA", // Updated to bright blue
                "off-white": "#F7F8FA",
                "surface": "#FFFFFF",
                "gray-border": "#E6E8EC",
                "text-main": "#0F172A",
                "text-secondary": "#64748B",
                "muted": "#EEF2F7", // Added for chips/labels
                "blue-tint": "#EFF6FF",
                "success": "#16A34A",
                "warning": "#F59E0B",
                "danger": "#DC2626",
            },
            fontFamily: {
                sans: ["Inter", "sans-serif"],
            },
            borderRadius: {
                "card": "12px",
                "pill": "9999px",
            },
            spacing: {
                '18': '4.5rem', // 72px if needed
                'header': '64px', // Standard header height
            },
            backgroundImage: {
                'dtf-texture': "url('https://images.unsplash.com/photo-1503342217505-b0a15ec3261c?q=80&w=2070&auto=format&fit=crop')",
            }
        },
    },
    plugins: [],
}
