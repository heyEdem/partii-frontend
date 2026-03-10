'use client'

import { useRef, KeyboardEvent, ClipboardEvent, ChangeEvent } from 'react'
import { cn } from '@/lib/utils'

interface OtpInputProps {
  value: string
  onChange: (val: string) => void
}

export function OtpInput({ value, onChange }: OtpInputProps) {
  const inputsRef = useRef<(HTMLInputElement | null)[]>([])
  const digits = value.padEnd(6, '').slice(0, 6).split('')

  const focus = (index: number) => {
    inputsRef.current[index]?.focus()
  }

  const handleChange = (index: number, e: ChangeEvent<HTMLInputElement>) => {
    const raw = e.target.value.replace(/\D/g, '')
    if (!raw) return
    const char = raw[raw.length - 1]
    const newDigits = [...digits]
    newDigits[index] = char
    onChange(newDigits.join('').slice(0, 6))
    if (index < 5) focus(index + 1)
  }

  const handleKeyDown = (index: number, e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace') {
      e.preventDefault()
      const newDigits = [...digits]
      if (newDigits[index]) {
        newDigits[index] = ''
        onChange(newDigits.join(''))
      } else if (index > 0) {
        newDigits[index - 1] = ''
        onChange(newDigits.join(''))
        focus(index - 1)
      }
    } else if (e.key === 'ArrowLeft' && index > 0) {
      focus(index - 1)
    } else if (e.key === 'ArrowRight' && index < 5) {
      focus(index + 1)
    }
  }

  const handlePaste = (e: ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault()
    const pasted = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, 6)
    onChange(pasted.padEnd(6, '').slice(0, 6))
    const nextIndex = Math.min(pasted.length, 5)
    focus(nextIndex)
  }

  return (
    <div className="flex gap-3 justify-center">
      {Array.from({ length: 6 }).map((_, i) => (
        <input
          key={i}
          ref={(el) => { inputsRef.current[i] = el }}
          type="text"
          inputMode="numeric"
          maxLength={1}
          value={digits[i] === ' ' ? '' : digits[i]}
          onChange={(e) => handleChange(i, e)}
          onKeyDown={(e) => handleKeyDown(i, e)}
          onPaste={handlePaste}
          onFocus={(e) => e.target.select()}
          className={cn(
            'w-11 h-14 text-center text-h1 bg-bg-surface border border-border rounded-input',
            'focus:border-accent-primary focus:shadow-lavender-ring outline-none',
            'text-text-primary transition-all',
          )}
        />
      ))}
    </div>
  )
}
