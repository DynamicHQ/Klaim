'use client';

import { FaInfoCircle } from 'react-icons/fa';

/**
 * Security Information Tooltip Component
 * 
 * This component provides contextual security information through interactive
 * tooltips that explain transaction security features and verification processes.
 * It enhances user understanding of security measures by displaying helpful
 * information about message signing, bot prevention, and transaction verification
 * without cluttering the main interface. The component supports accessibility
 * features including keyboard navigation and screen reader compatibility.
 */
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