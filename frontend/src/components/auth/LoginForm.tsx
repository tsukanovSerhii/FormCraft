import { zodResolver } from '@hookform/resolvers/zod'
import { Loader2 } from 'lucide-react'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { useNavigate } from 'react-router-dom'
import { z } from 'zod'
import { useAuthStore } from '@/store/authStore'
import { InputField, TextInput, PasswordInput } from './AuthInputs'
import { OAuthButtons } from './OAuthButtons'

const loginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(1, 'Password is required'),
  remember: z.boolean().optional(),
})

type LoginData = z.infer<typeof loginSchema>

const API = import.meta.env.VITE_API_URL ?? 'http://localhost:3000'

export function LoginForm({ onSwitch }: { onSwitch: () => void }) {
  const navigate = useNavigate()
  const { setAuth } = useAuthStore()
  const [serverError, setServerError] = useState('')

  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<LoginData>({
    resolver: zodResolver(loginSchema),
  })

  async function onSubmit(data: LoginData) {
    setServerError('')
    try {
      const res = await fetch(`${API}/api/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ email: data.email, password: data.password }),
      })
      const json = await res.json()
      if (!res.ok) throw new Error(json.error ?? 'Login failed')
      setAuth(json.user, json.accessToken)
      navigate('/forms')
    } catch (e) {
      setServerError(e instanceof Error ? e.message : 'Something went wrong')
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
      <InputField label="Email Address" error={errors.email?.message}>
        <TextInput
          {...register('email')}
          type="email"
          placeholder="name@company.com"
          hasError={!!errors.email}
        />
      </InputField>

      <InputField label="Password" error={errors.password?.message}>
        <div>
          <div className="flex justify-end mb-1.5">
            <button type="button" className="text-[12px] text-land-accent hover:text-land-accent3 transition-colors">
              Forgot password?
            </button>
          </div>
          <PasswordInput register={register('password')} error={errors.password?.message} placeholder="••••••••" />
        </div>
      </InputField>

      {serverError && (
        <div className="rounded-lg px-4 py-3 text-[13px] bg-red-500/10 border border-red-500/20 text-red-400">
          {serverError}
        </div>
      )}

      <button
        type="submit"
        disabled={isSubmitting}
        className="flex h-11 w-full items-center justify-center gap-2 rounded-lg text-[15px] font-bold text-[#fbf7ff] transition-all hover:-translate-y-px disabled:opacity-50 disabled:cursor-not-allowed mt-1"
        style={{ background: 'linear-gradient(135deg,#4e45e2 0%,#6a63ff 100%)', boxShadow: '0 4px 20px rgba(106,99,255,0.25)' }}
      >
        {isSubmitting ? <Loader2 size={16} className="animate-spin" /> : 'Sign In'}
      </button>

      <OAuthButtons />

      <p className="text-center text-[13px] text-land-text2">
        Don't have an account?{' '}
        <button type="button" onClick={onSwitch} className="font-bold text-land-accent hover:text-land-accent3 transition-colors">
          Create account
        </button>
      </p>
    </form>
  )
}
