'use client';

import { FaSpinner, FaShieldAlt, FaCheckCircle, FaExclamationTriangle, FaTimes } from 'react-icons/fa';

/**
 * Transaction Verification Modal Component
 * 
 * This component provides a comprehensive modal interface for displaying
 * transaction verification progress with step-by-step visual feedback.
 * It features progress tracking through verification stages, detailed
 * transaction information display, appropriate icons and messaging for
 * each verification step, and accessibility features including ARIA labels
 * and keyboard navigation. The modal guides users through the security
 * verification process with clear visual indicators and helpful instructions.
 */
export default function TransactionVerificationModal({ 
  isOpen, 
  onClose, 
  stepMessage, 
  verificationStep,
  currentVerification 
}) {
  if (!isOpen || !stepMessage) return null;

  // Dynamic icon selector based on verification step status and message type
  const getStepIcon = () => {
    switch (stepMessage.type) {
      case 'success':
        return <FaCheckCircle className="w-8 h-8 text-success" />;
      case 'error':
        return <FaExclamationTriangle className="w-8 h-8 text-error" />;
      case 'warning':
        return <FaShieldAlt className="w-8 h-8 text-warning" />;
      default:
        return <FaSpinner className="animate-spin w-8 h-8 text-primary" />;
    }
  };

  /**
   * Progress step generator with completion status tracking.
   * 
   * This function creates a visual progress indicator showing the current
   * verification step and completion status of previous steps. It provides
   * clear visual feedback about the verification process progress and
   * helps users understand where they are in the security workflow.
   */
  const getProgressSteps = () => {
    const steps = [
      { key: 'generated', label: 'Verification Required', completed: false },
      { key: 'signing', label: 'Sign Message', completed: false },
      { key: 'validating', label: 'Validate Signature', completed: false },
      { key: 'executing', label: 'Execute Transaction', completed: false },
      { key: 'completed', label: 'Complete', completed: false }
    ];

    const currentStepIndex = steps.findIndex(step => step.key === verificationStep);
    
    return steps.map((step, index) => ({
      ...step,
      completed: index < currentStepIndex || (index === currentStepIndex && verificationStep === 'completed'),
      active: index === currentStepIndex && verificationStep !== 'completed'
    }));
  };

  const progressSteps = getProgressSteps();
  const canClose = verificationStep === 'completed' || verificationStep === 'failed';

  return (
    <div 
      className="modal modal-open" 
      role="dialog" 
      aria-modal="true"
      aria-labelledby="verification-title"
      aria-describedby="verification-description"
    >
      <div className="modal-box max-w-md">
        <div className="flex justify-between items-center mb-6">
          <h3 id="verification-title" className="font-bold text-lg">Transaction Verification</h3>
          {canClose && (
            <button 
              className="btn btn-sm btn-circle btn-ghost"
              onClick={onClose}
              aria-label="Close verification modal"
            >
              <FaTimes aria-hidden="true" />
            </button>
          )}
        </div>

        {/* Progress Steps */}
        <div className="mb-6" role="progressbar" aria-label="Transaction verification progress">
          <ul className="steps steps-vertical w-full">
            {progressSteps.map((step, index) => (
              <li 
                key={step.key}
                className={`step ${step.completed ? 'step-primary' : ''} ${step.active ? 'step-accent' : ''}`}
                aria-current={step.active ? 'step' : undefined}
              >
                <div className="text-left">
                  <div className="font-medium">{step.label}</div>
                </div>
              </li>
            ))}
          </ul>
        </div>

        {/* Current Step Status */}
        <div className="text-center mb-6" id="verification-description">
          <div className="mb-4" aria-hidden="true">
            {getStepIcon()}
          </div>
          <h4 className="font-bold text-lg mb-2">{stepMessage.title}</h4>
          <p className="text-base-content/70">{stepMessage.message}</p>
        </div>

        {/* Transaction Details */}
        {currentVerification?.formatted && (
          <div className="bg-base-200 rounded-lg p-4 mb-6">
            <div className="flex items-center gap-2 mb-2">
              <span className="text-2xl">{currentVerification.formatted.icon}</span>
              <div>
                <div className="font-semibold">{currentVerification.formatted.action}</div>
                <div className="text-sm text-base-content/70">{currentVerification.formatted.description}</div>
              </div>
            </div>
            {currentVerification.formatted.amount && (
              <div className="text-right">
                <span className="font-bold text-primary">{currentVerification.formatted.amount}</span>
              </div>
            )}
          </div>
        )}

        {/* Action Buttons */}
        <div className="modal-action">
          {canClose ? (
            <button 
              className="btn btn-primary" 
              onClick={onClose}
              autoFocus
            >
              Close
            </button>
          ) : (
            <div className="text-center w-full" role="status" aria-live="polite">
              <p className="text-sm text-base-content/50">
                {verificationStep === 'signing' 
                  ? 'Please check your wallet to sign the verification message'
                  : 'Please wait while we process your transaction'
                }
              </p>
            </div>
          )}
        </div>
      </div>
      
      {/* Backdrop - only closeable when transaction is complete */}
      {canClose && (
        <div className="modal-backdrop" onClick={onClose}></div>
      )}
    </div>
  );
}