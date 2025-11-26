/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./components/**/*.{js,vue,ts}",
        "./layouts/**/*.vue",
        "./pages/**/*.vue",
        "./plugins/**/*.{js,ts}",
        "./app.vue",
    ],
    theme: {
        extend: {
            colors: {
                trading: {
                    primary: '#2d8f8f',
                    secondary: '#1a6464',
                    success: '#10b981',
                    error: '#ef4444',
                    warning: '#f59e0b'
                }
            }
        },
    },
    plugins: [],
}
