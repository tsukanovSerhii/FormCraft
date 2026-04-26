import { Eye, EyeOff } from 'lucide-react'
import { useState } from 'react'

export function InputField({ label, error, children }: { label: string; error?: string; children: React.ReactNode }) {
  return (
    <div className="flex flex-col gap-1.5">
      <label className="text-[12px] font-bold tracking-[0.04em] uppercase text-land-text2">{label}</label>
      {children}
      {error && <p className="text-[12px] text-red-400 font-medium">{error}</p>}
    </div>
  )
}

export function TextInput({ hasError, ...props }: React.InputHTMLAttributes<HTMLInputElement> & { hasError?: boolean }) {
  return (
    <input
      {...props}
      className={[
        'w-full bg-land-bg3 rounded-lg px-4 py-3 text-[15px] text-land-text outline-none transition-all border-[1.5px] placeholder:text-land-text3',
        'focus:bg-land-bg2 focus:border-land-accent',
        hasError ? 'border-red-500 focus:border-red-500' : 'border-transparent',
      ].join(' ')}
    />
  )
}

export function PasswordInput({ register, error, placeholder = 'Enter password' }: {
  register: import('react-hook-form').UseFormRegisterReturn
  error?: string
  placeholder?: string
}) {
  const [show, setShow] = useState(false)
  return (
    <div className="relative">
      <input
        {...register}
        type={show ? 'text' : 'password'}
        placeholder={placeholder}
        className={[
          'w-full bg-land-bg3 rounded-lg px-4 py-3 pr-11 text-[15px] text-land-text outline-none transition-all border-[1.5px] placeholder:text-land-text3',
          'focus:bg-land-bg2 focus:border-land-accent',
          error ? 'border-red-500' : 'border-transparent',
        ].join(' ')}
      />
      <button
        type="button"
        onClick={() => setShow(v => !v)}
        className="absolute right-3 top-1/2 -translate-y-1/2 text-land-text3 hover:text-land-text2 transition-colors"
      >
        {show ? <EyeOff size={16} /> : <Eye size={16} />}
      </button>
    </div>
  )
}
