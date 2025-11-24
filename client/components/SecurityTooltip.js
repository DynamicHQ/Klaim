'use client';

import { FaInfoCircle } from 'react-icons/fa';

export default function SecurityTooltip({ children, content }) {
  return (
    <div className="tooltip tooltip-top" data-tip={content}>
      <div className="flex items-center gap-1">
        {children}
        <FaInfoCircle 
          className="w-3 h-3 text-base-content/50 hover:text-base-content/80 cursor-help" 
          aria-label={content}
          role="img"
          tabIndex={0}
        />
      </div>
    </div>
  );
}