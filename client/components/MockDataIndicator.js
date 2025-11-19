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
