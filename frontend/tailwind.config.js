/** @type {import('tailwindcss').Config} */
export default {
    content: ["./index.html", "./src/**/*.{js,jsx}"],
    darkMode: "class",
    theme: {
      extend: {
        colors: {
          primary: {
            50:  "#f0f9f1",
            100: "#dcf0de",
            200: "#bae0be",
            300: "#8cc992",
            400: "#5aab62",
            500: "#3b8f44",
            600: "#2c7235",
            700: "#255b2d",
            800: "#1f4826",
            900: "#1a3b20",
          },
          gold: {
            50:  "#fdf9ec",
            100: "#faf0c8",
            200: "#f5e08d",
            300: "#efca52",
            400: "#e9b32e",
            500: "#d4961c",
            600: "#b57417",
            700: "#925519",
            800: "#79441b",
            900: "#66391c",
          },
          sand: {
            50:  "#fbf7ef",
            100: "#f4ead2",
            200: "#e9d29d",
            300: "#ddb56c",
            400: "#d49c4a",
            500: "#cb8336",
          },
          crimson: {
            500: "#b33a3a",
            600: "#962d2d",
          },
        },
        fontFamily: {
          // `font-pashto` utility — same stack as the .pashto-text class in
          // index.css. MS Shamla first, Noto Nastaliq Urdu as fallback while
          // the .ttf is still downloading (or if the file is missing).
          pashto: ['"MS Shamla"', '"Noto Nastaliq Urdu"', 'serif'],
          sans: ['Inter', 'ui-sans-serif', 'system-ui', 'sans-serif'],
          display: ['"Playfair Display"', 'serif'],
        },
        backgroundImage: {
          'hero-pattern':
            "radial-gradient(circle at 20% 20%, rgba(212,150,28,0.15) 0, transparent 40%), radial-gradient(circle at 80% 70%, rgba(59,143,68,0.18) 0, transparent 45%)",
        },
        animation: {
          'fade-in': 'fadeIn 0.6s ease-out',
          'slide-up': 'slideUp 0.5s ease-out',
          'float': 'float 6s ease-in-out infinite',
        },
        keyframes: {
          fadeIn: {
            '0%': { opacity: '0' },
            '100%': { opacity: '1' },
          },
          slideUp: {
            '0%': { transform: 'translateY(20px)', opacity: '0' },
            '100%': { transform: 'translateY(0)', opacity: '1' },
          },
          float: {
            '0%, 100%': { transform: 'translateY(0)' },
            '50%': { transform: 'translateY(-12px)' },
          },
        },
      },
    },
    plugins: [],
  }