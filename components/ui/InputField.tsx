import { forwardRef, InputHTMLAttributes, TextareaHTMLAttributes } from 'react'
import { cn } from '@/lib/utils'

interface InputFieldProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string
  error?: string
  hint?: string
}

export const InputField = forwardRef<HTMLInputElement, InputFieldProps>(
  ({ label, error, hint, className, id, ...props }, ref) => {
    const fieldId = id ?? label?.toLowerCase().replace(/\s+/g, '-')

    return (
      <div className="flex flex-col gap-2">
        {label && (
          <label htmlFor={fieldId} className="text-caption font-medium text-text-secondary">
            {label}
          </label>
        )}
        <input
          ref={ref}
          id={fieldId}
          className={cn(
            'h-12 px-4 bg-bg-surface border border-border rounded-input text-body text-text-primary placeholder:text-text-secondary transition-all outline-none',
            'focus:border-accent-primary focus:shadow-lavender-ring',
            error && 'border-error focus:border-error focus:shadow-none',
            className,
          )}
          {...props}
        />
        {error && <p className="text-[12px] text-error">{error}</p>}
        {hint && !error && <p className="text-caption text-text-secondary">{hint}</p>}
      </div>
    )
  },
)
InputField.displayName = 'InputField'

interface TextareaFieldProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string
  error?: string
  hint?: string
}

export const TextareaField = forwardRef<HTMLTextAreaElement, TextareaFieldProps>(
  ({ label, error, hint, className, id, ...props }, ref) => {
    const fieldId = id ?? label?.toLowerCase().replace(/\s+/g, '-')

    return (
      <div className="flex flex-col gap-2">
        {label && (
          <label htmlFor={fieldId} className="text-caption font-medium text-text-secondary">
            {label}
          </label>
        )}
        <textarea
          ref={ref}
          id={fieldId}
          className={cn(
            'min-h-[100px] px-4 py-3.5 bg-bg-surface border border-border rounded-input text-body text-text-primary placeholder:text-text-secondary transition-all outline-none resize-y',
            'focus:border-accent-primary focus:shadow-lavender-ring',
            error && 'border-error focus:border-error focus:shadow-none',
            className,
          )}
          {...props}
        />
        {error && <p className="text-[12px] text-error">{error}</p>}
        {hint && !error && <p className="text-caption text-text-secondary">{hint}</p>}
      </div>
    )
  },
)
TextareaField.displayName = 'TextareaField'
