// src/core/components/ui/Modal.tsx
import React from 'react';
import * as Dialog from '@radix-ui/react-dialog';
import { X } from 'lucide-react';

import { cn } from '../../../utils/';

export type ModalSize = 'sm' | 'md' | 'lg' | 'xl' | 'full';

interface ModalProps {
  /** Stato aperto/chiuso del modal */
  isOpen: boolean;
  /** Callback per chiusura modal */
  onClose: () => void;
  /** Titolo del modal */
  title?: string;
  /** Descrizione sotto il titolo */
  description?: string;
  /** Contenuto principale del modal */
  children: React.ReactNode;
  /** Dimensione del modal */
  size?: ModalSize;
  /** Nasconde il pulsante X di chiusura */
  hideCloseButton?: boolean;
  /** Previene chiusura con ESC o click backdrop */
  preventClose?: boolean;
  /** Footer personalizzato */
  footer?: React.ReactNode;
  /** Classi CSS aggiuntive per il contenuto */
  className?: string;
  /** Classi CSS aggiuntive per l'overlay */
  overlayClassName?: string;
}

/**
 * Modal component con Radix UI integrato nel theme system EDG.
 * Usa classi Tailwind e CSS custom properties per consistency completa.
 */
const Modal: React.FC<ModalProps> = ({
  isOpen,
  onClose,
  title,
  description,
  children,
  size = 'md',
  hideCloseButton = false,
  preventClose = false,
  footer,
  className,
  overlayClassName,
}) => {
  // 📏 Size variants per il modal
  const sizeClasses = {
    sm: 'max-w-sm',
    md: 'max-w-md',
    lg: 'max-w-lg',
    xl: 'max-w-2xl',
    full: 'max-w-[95vw] max-h-[95vh]',
  };

  // 🎨 Classes per overlay/backdrop - USA IL NOSTRO THEME SYSTEM
  const overlayClasses = cn(
    // Base styling con theme system
    'fixed inset-0 z-50 bg-black/50 backdrop-blur-sm',
    // Animations
    'data-[state=open]:animate-in data-[state=closed]:animate-out',
    'data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0',
    'duration-200',
    overlayClassName
  );

  // 🎨 Classes per positioning del modal content
  const contentClasses = cn(
    // Positioning
    'fixed left-[50%] top-[50%] z-50 translate-x-[-50%] translate-y-[-50%]',
    // Sizing
    'w-full',
    sizeClasses[size],
    // Max height and scroll
    'max-h-[90vh] overflow-hidden',
    // Animations
    'data-[state=open]:animate-in data-[state=closed]:animate-out',
    'data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0',
    'data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95',
    'data-[state=closed]:slide-out-to-left-1/2 data-[state=closed]:slide-out-to-top-[48%]',
    'data-[state=open]:slide-in-from-left-1/2 data-[state=open]:slide-in-from-top-[48%]',
    'duration-200',
    className
  );

  return (
    <Dialog.Root open={isOpen} onOpenChange={preventClose ? undefined : onClose}>
      {/* Overlay/Backdrop */}
      <Dialog.Portal>
        <Dialog.Overlay className={overlayClasses} />

        {/* Modal Content - USA TAILWIND */}
        <Dialog.Content
          className={contentClasses}
          onEscapeKeyDown={preventClose ? e => e.preventDefault() : undefined}
          onPointerDownOutside={e => {
            if (preventClose) {
              e.preventDefault();
              return;
            }
            // Se c'è un qualsiasi dropdown Radix aperto nel body,
            // non chiudere la Modal — lascia che Radix lo chiuda prima
            const hasOpenRadixPortal = document.querySelector('[data-radix-popper-content-wrapper]') !== null;
            if (hasOpenRadixPortal) {
              e.preventDefault();
            }
          }}
          asChild
        >
          <div className='bg-bg-modal border border-border-default rounded-xl shadow-xl flex flex-col'>
            {/* Header */}
            {(title || !hideCloseButton) && (
              <div className='bg-bg-modal flex items-center justify-between p-6 border-b border-border-default flex-shrink-0'>
                <div className='flex-1 min-w-0'>
                  {title && (
                    <Dialog.Title asChild>
                      <h2 className='text-text-primary text-lg font-semibold'>{title}</h2>
                    </Dialog.Title>
                  )}
                  {description && (
                    <Dialog.Description asChild>
                      <p className='text-text-secondary mt-1 text-sm'>{description}</p>
                    </Dialog.Description>
                  )}
                </div>

                {/* Close Button */}
                {!hideCloseButton && (
                  <Dialog.Close asChild>
                    <button
                      onClick={onClose}
                      className='ml-4 p-2 rounded-lg hover:bg-bg-hover transition-colors flex-shrink-0'
                      aria-label='Chiudi modal'
                    >
                      <X className='w-5 h-5 text-text-secondary' />
                    </button>
                  </Dialog.Close>
                )}
              </div>
            )}

            {/* Content - USA TAILWIND */}
            <div className='bg-bg-modal flex-1 overflow-y-auto'>{children}</div>

            {/* Footer */}
            {footer && <div className='bg-bg-modal border-t border-border-default p-6 flex-shrink-0'>{footer}</div>}
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
};

export default Modal;
