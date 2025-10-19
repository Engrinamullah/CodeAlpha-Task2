// Custom Tailwind configuration for iPhone-style colors
tailwind.config = {
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
      },
      colors: {
        'calc-black': '#000000',
        'calc-num-gray': '#333333',
        'calc-util-gray': '#a6a6a6',
        'calc-op-orange': '#ff9500',
        'calc-text-light': '#ffffff',
        'calc-text-dark': '#000000',
      },
    },
  },
};
