# Mock Data Indicator

## Overview

Added a visual indicator to show users when the application is running in development mode with mock data.

## Component Created

**File**: `client/components/MockDataIndicator.js`

### Features

- ✅ **Fixed position** - Bottom left corner of screen
- ✅ **Warning badge** - Yellow alert style to indicate development mode
- ✅ **Dismissible** - Users can close it with X button
- ✅ **Clear messaging** - Shows "Development Mode" and "Using mock data"
- ✅ **Icon** - Database icon for visual clarity
- ✅ **High z-index** - Always visible above other content

### Design

```
┌─────────────────────────────────────┐
│ 🗄️  Development Mode            ✕  │
│     Using mock data - No blockchain │
└─────────────────────────────────────┘
```

### Component Code

```javascript
'use client';

import { useState } from 'react';
import { FaDatabase, FaTimes } from 'react-icons/fa';

export default function MockDataIndicator() {
  const [isVisible, setIsVisible] = useState(true);

  if (!isVisible) return null;

  return (
    <div className="fixed bottom-4 left-4 z-50">
      <div className="alert alert-warning shadow-lg max-w-sm">
        <div className="flex items-center gap-2">
          <FaDatabase className="w-5 h-5" />
          <div>
            <h3 className="font-bold text-sm">Development Mode</h3>
            <div className="text-xs">Using mock data - No blockchain connection</div>
          </div>
        </div>
        <button
          onClick={() => setIsVisible(false)}
          className="btn btn-ghost btn-sm btn-circle"
          aria-label="Close"
        >
          <FaTimes className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
```

## Integration

**Added to**: `client/app/layout.js`

The indicator is now globally available on all pages:

```javascript
import MockDataIndicator from "@/components/MockDataIndicator";

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <ThemeProvider attribute="data-theme" defaultTheme="light">
          <Navbar />
          {children}
          <MockDataIndicator />
        </ThemeProvider>
      </body>
    </html>
  );
}
```

## User Experience

### When Visible
- Appears in bottom-left corner
- Yellow warning badge style
- Clear "Development Mode" message
- Informs users about mock data usage
- Shows no blockchain connection

### When Dismissed
- User clicks X button
- Indicator disappears
- State persists for current session
- Reappears on page refresh

## Styling

### DaisyUI Classes Used
- `alert alert-warning` - Yellow warning style
- `shadow-lg` - Prominent shadow
- `btn btn-ghost btn-sm btn-circle` - Close button
- `fixed bottom-4 left-4` - Positioning
- `z-50` - High z-index

### Responsive
- Works on all screen sizes
- `max-w-sm` prevents it from being too wide
- Compact design for mobile

## When to Remove

Remove or hide this indicator when:
1. Switching from mock data to real backend
2. Deploying to production
3. Connecting to actual blockchain

### Option 1: Remove Component
```javascript
// In layout.js, remove:
<MockDataIndicator />
```

### Option 2: Conditional Rendering
```javascript
// Only show in development
{process.env.NODE_ENV === 'development' && <MockDataIndicator />}
```

### Option 3: Environment Variable
```javascript
// In MockDataIndicator.js
const SHOW_INDICATOR = process.env.NEXT_PUBLIC_USE_MOCK_DATA === 'true';

if (!SHOW_INDICATOR || !isVisible) return null;
```

## Benefits

1. **Clear Communication** - Users know they're in dev mode
2. **Prevents Confusion** - No wondering why blockchain isn't working
3. **Professional** - Shows attention to detail
4. **Dismissible** - Doesn't get in the way
5. **Visual Feedback** - Immediate understanding of app state

## Customization Options

### Change Position
```javascript
// Top right
<div className="fixed top-4 right-4 z-50">

// Bottom right
<div className="fixed bottom-4 right-4 z-50">

// Top left
<div className="fixed top-4 left-4 z-50">
```

### Change Style
```javascript
// Info style (blue)
<div className="alert alert-info shadow-lg max-w-sm">

// Success style (green)
<div className="alert alert-success shadow-lg max-w-sm">

// Error style (red)
<div className="alert alert-error shadow-lg max-w-sm">
```

### Change Message
```javascript
<h3 className="font-bold text-sm">Demo Mode</h3>
<div className="text-xs">Sample data for testing</div>
```

### Add Link
```javascript
<div>
  <h3 className="font-bold text-sm">Development Mode</h3>
  <div className="text-xs">
    Using mock data - 
    <a href="/docs" className="link">Learn more</a>
  </div>
</div>
```

## Accessibility

- ✅ Close button has `aria-label="Close"`
- ✅ Semantic HTML structure
- ✅ Keyboard accessible
- ✅ Screen reader friendly
- ✅ High contrast colors

## Testing

### Manual Testing
1. Load any page in the app
2. Verify indicator appears in bottom-left
3. Click X button
4. Verify indicator disappears
5. Refresh page
6. Verify indicator reappears

### Visual Testing
- Check on mobile devices
- Verify it doesn't overlap important content
- Test with light and dark themes
- Ensure text is readable

## Summary

Added a professional mock data indicator that:
- ✅ Clearly shows development mode
- ✅ Informs about mock data usage
- ✅ Can be dismissed by users
- ✅ Appears on all pages
- ✅ Styled with DaisyUI
- ✅ Fully accessible
- ✅ Easy to customize or remove

Perfect for development and testing! 🎯
