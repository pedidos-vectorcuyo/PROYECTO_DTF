
/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            colors: {
                primary: "#2D47B1",
                "off-white": "#F7F8FA",
                "surface": "#FFFFFF",
                "gray-border": "#E6E8EC",
                "text-main": "#0F172A",
                "text-secondary": "#64748B",
                "blue-tint": "#EFF6FF",
                "accent-blue-bg": "#EBF0FF",
                "accent-blue-text": "#2D47B1",
                "status-green": "#16A34A",
                "status-amber": "#D97706",
                "status-slate": "#475569",
                "status-indigo": "#4F46E5",
                "bg-green-tint": "#DCFCE7",
                "bg-amber-tint": "#FEF3C7",
                "bg-slate-tint": "#F1F5F9",
                "bg-indigo-tint": "#E0E7FF",
            },
            fontFamily: {
                sans: ["Inter", "sans-serif"],
            },
            borderRadius: {
                "card": "12px",
            },
            backgroundImage: {
                'dtf-texture': "url('https://images.unsplash.com/photo-1620916566398-39f1143ab7be?q=80&w=1887&auto=format&fit=crop')",
            }
        },
    },
    plugins: [],
}
