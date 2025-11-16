# Theme System Guide

This application uses DaisyUI themes with persistent storage in localStorage.

## Features

- ✅ Light and Dark theme support
- ✅ Theme preference saved in browser localStorage
- ✅ Theme persists across page refreshes
- ✅ Smooth theme transitions
- ✅ Reusable theme hook

## How It Works

### Theme Toggle in Navbar

The navbar includes a sun/moon icon toggle that switches between light and dark themes:

- **Sun Icon** (☀️): Displayed in light mode, click to switch to dark
- **Moon Icon** (🌙): Displayed in dark mode, click to switch to light

### Theme Persistence

The theme preference is stored in `localStorage` with the key `theme`:

```javascript
// Save theme
localStorage.setItem('theme', 'dark');

// Load theme
const savedTheme = localStorage.getItem('theme') || 'light';
```

### Theme Application

The theme is applied to the document root using DaisyUI's `data-theme` attribute:

```javascript
document.documentElement.setAttribute('data-theme', 'dark');
```

## Using the Theme Hook

### Basic Usage

```javascript
import { useTheme } from '@/hooks/useTheme';

function MyComponent() {
  const { theme, toggleTheme, isDark, isLight } = useTheme();

  return (
    <div>
      <p>Current theme: {theme}</p>
      <button onClick={toggleTheme}>
        Toggle Theme
      </button>
      {isDark && <p>Dark mode is active</p>}
    </div>
  );
}
```

### Available Properties

```javascript
const {
  theme,        // Current theme: 'light' or 'dark'
  setTheme,     // Function to set specific theme: setTheme('dark')
  toggleTheme,  // Function to toggle between themes
  isDark,       // Boolean: true if dark theme
  isLight,      // Boolean: true if light theme
} = useTheme();
```

## Implementation in Navbar

### Frontend Navbar

```javascript
import { useState, useEffect } from 'react';

export default function Navbar() {
  const [theme, setTheme] = useState('light');

  // Load theme on mount
  useEffect(() => {
    const savedTheme = localStorage.getItem('theme') || 'light';
    setTheme(savedTheme);
    document.documentElement.setAttribute('data-theme', savedTheme);
  }, []);

  // Toggle and save theme
  const handleThemeToggle = () => {
    const newTheme = theme === 'light' ? 'dark' : 'light';
    setTheme(newTheme);
    localStorage.setItem('theme', newTheme);
    document.documentElement.setAttribute('data-theme', newTheme);
  };

  return (
    <label className="swap swap-rotate cursor-pointer">
      <input 
        type="checkbox" 
        checked={theme === 'dark'}
        onChange={handleThemeToggle}
        className="hidden"
      />
      {/* Icons conditionally rendered based on theme */}
    </label>
  );
}
```

## DaisyUI Theme Configuration

### Available Themes

DaisyUI comes with built-in themes. The default configuration uses:
- `light` - Light theme
- `dark` - Dark theme

### Customizing Themes

You can customize themes in `tailwind.config.js`:

```javascript
module.exports = {
  daisyui: {
    themes: [
      {
        light: {
          "primary": "#570df8",
          "secondary": "#f000b8",
          "accent": "#37cdbe",
          "neutral": "#3d4451",
          "base-100": "#ffffff",
        },
        dark: {
          "primary": "#661ae6",
          "secondary": "#d926aa",
          "accent": "#1fb2a5",
          "neutral": "#2a2e37",
          "base-100": "#1d232a",
        },
      },
    ],
  },
}
```

## Theme-Aware Components

### Conditional Styling

```javascript
function ThemedComponent() {
  const { isDark } = useTheme();

  return (
    <div className={isDark ? 'border-white' : 'border-black'}>
      Content
    </div>
  );
}
```

### Using DaisyUI Classes

DaisyUI automatically handles theme colors:

```javascript
<button className="btn btn-primary">
  {/* Color changes automatically with theme */}
</button>
```

## Best Practices

### 1. Use DaisyUI Semantic Colors

Instead of hardcoding colors, use DaisyUI's semantic color classes:

```javascript
// ✅ Good - adapts to theme
<div className="bg-base-100 text-base-content">

// ❌ Bad - doesn't adapt to theme
<div className="bg-white text-black">
```

### 2. Initialize Theme Early

Load the theme as early as possible to prevent flash of wrong theme:

```javascript
useEffect(() => {
  const savedTheme = localStorage.getItem('theme') || 'light';
  document.documentElement.setAttribute('data-theme', savedTheme);
}, []);
```

### 3. Provide Visual Feedback

Always show the current theme state clearly:

```javascript
<label className="swap swap-rotate cursor-pointer">
  {/* Visual indicator of current theme */}
</label>
```

## Troubleshooting

### Theme Not Persisting

**Problem**: Theme resets on page refresh

**Solution**: Check that localStorage is working:
```javascript
console.log(localStorage.getItem('theme'));
```

### Theme Not Applying

**Problem**: Theme changes but UI doesn't update

**Solution**: Ensure `data-theme` is set on document root:
```javascript
document.documentElement.setAttribute('data-theme', theme);
```

### Flash of Wrong Theme

**Problem**: Brief flash of light theme before dark theme loads

**Solution**: Load theme synchronously before render:
```javascript
// In _app.js or layout.js
if (typeof window !== 'undefined') {
  const theme = localStorage.getItem('theme') || 'light';
  document.documentElement.setAttribute('data-theme', theme);
}
```

## Browser Compatibility

The theme system works in all modern browsers that support:
- localStorage API
- CSS custom properties (CSS variables)
- data attributes

### Supported Browsers
- ✅ Chrome 49+
- ✅ Firefox 31+
- ✅ Safari 10+
- ✅ Edge 79+

## Accessibility

### Keyboard Navigation

The theme toggle is keyboard accessible:
- Tab to focus the toggle
- Enter or Space to toggle theme

### Screen Readers

Add ARIA labels for better accessibility:

```javascript
<label 
  className="swap swap-rotate cursor-pointer"
  aria-label={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
>
  {/* Toggle content */}
</label>
```

## Advanced Usage

### System Preference Detection

Detect user's system theme preference:

```javascript
useEffect(() => {
  const savedTheme = localStorage.getItem('theme');
  
  if (!savedTheme) {
    // No saved preference, use system preference
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    const systemTheme = prefersDark ? 'dark' : 'light';
    setTheme(systemTheme);
  }
}, []);
```

### Multiple Themes

Support more than two themes:

```javascript
const themes = ['light', 'dark', 'cupcake', 'cyberpunk'];
const [themeIndex, setThemeIndex] = useState(0);

const cycleTheme = () => {
  const nextIndex = (themeIndex + 1) % themes.length;
  setThemeIndex(nextIndex);
  const newTheme = themes[nextIndex];
  localStorage.setItem('theme', newTheme);
  document.documentElement.setAttribute('data-theme', newTheme);
};
```

## Testing

### Manual Testing Checklist

- [ ] Toggle theme in navbar
- [ ] Refresh page - theme persists
- [ ] Open in new tab - theme matches
- [ ] Clear localStorage - defaults to light
- [ ] Check all pages for theme consistency

### Automated Testing

```javascript
describe('Theme System', () => {
  it('should save theme to localStorage', () => {
    const { result } = renderHook(() => useTheme());
    
    act(() => {
      result.current.setTheme('dark');
    });
    
    expect(localStorage.getItem('theme')).toBe('dark');
  });
});
```

## Summary

The theme system provides:
- Persistent theme preference across sessions
- Smooth transitions between themes
- Easy-to-use hook for theme management
- Full DaisyUI theme support
- Accessible theme toggle

For questions or issues, refer to:
- [DaisyUI Themes Documentation](https://daisyui.com/docs/themes/)
- [localStorage API](https://developer.mozilla.org/en-US/docs/Web/API/Window/localStorage)
