import { zodResolver } from '@hookform/resolvers/zod'
import { ArrowLeft, Eye, EyeOff, Loader2 } from 'lucide-react'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { Link, useNavigate } from 'react-router-dom'
import { z } from 'zod'
import { useAuthStore } from '@/store/authStore'

const loginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(1, 'Password is required'),
  remember: z.boolean().optional(),
})

const registerSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  email: z.string().email('Invalid email address'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
})

type LoginData = z.infer<typeof loginSchema>
type RegisterData = z.infer<typeof registerSchema>

const API = import.meta.env.VITE_API_URL ?? 'http://localhost:3000'

const FEATURES = [
  { icon: '⚡', text: 'Drag & drop form builder' },
  { icon: '📊', text: 'Real-time response analytics' },
  { icon: '🔒', text: 'Enterprise-grade security' },
]

function GoogleIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
      <path d="M17.64 9.2c0-.637-.057-1.251-.164-1.84H9v3.481h4.844a4.14 4.14 0 01-1.796 2.716v2.259h2.908c1.702-1.567 2.684-3.875 2.684-6.615z" fill="#4285F4"/>
      <path d="M9 18c2.43 0 4.467-.806 5.956-2.18l-2.908-2.259c-.806.54-1.837.86-3.048.86-2.344 0-4.328-1.584-5.036-3.711H.957v2.332A8.997 8.997 0 009 18z" fill="#34A853"/>
      <path d="M3.964 10.71A5.41 5.41 0 013.682 9c0-.593.102-1.17.282-1.71V4.958H.957A8.996 8.996 0 000 9c0 1.452.348 2.827.957 4.042l3.007-2.332z" fill="#FBBC05"/>
      <path d="M9 3.58c1.321 0 2.508.454 3.44 1.345l2.582-2.58C13.463.891 11.426 0 9 0A8.997 8.997 0 00.957 4.958L3.964 6.29C4.672 4.163 6.656 3.58 9 3.58z" fill="#EA4335"/>
    </svg>
  )
}

function PasswordInput({ register, error, placeholder = 'Enter password' }: {
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
        className="w-full rounded-xl border px-4 py-3 pr-11 text-[14px] outline-none transition-all focus:ring-2"
        style={{
          background: '#fff',
          color: '#111',
          borderColor: error ? '#ef4444' : '#d1d5db',
        }}
      />
      <button
        type="button"
        onClick={() => setShow(v => !v)}
        className="absolute right-3 top-1/2 -translate-y-1/2 text-text-muted hover:text-text-primary transition-colors"
      >
        {show ? <EyeOff size={16} /> : <Eye size={16} />}
      </button>
    </div>
  )
}

function Field({ label, error, children }: { label: string; error?: string; children: React.ReactNode }) {
  return (
    <div className="flex flex-col gap-1.5">
      <label className="text-[13px] font-medium" style={{ color: '#333' }}>{label}</label>
      {children}
      {error && <p className="text-[12px]" style={{ color: '#ef4444' }}>{error}</p>}
    </div>
  )
}

function LoginForm({ onSwitch }: { onSwitch: () => void }) {
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
      <Field label="Email Address" error={errors.email?.message}>
        <input
          {...register('email')}
          type="email"
          placeholder="name@company.com"
          className="w-full rounded-xl border px-4 py-3 text-[14px] outline-none transition-all focus:ring-2 focus:ring-[#6c63ff]/20"
          style={{ background: '#fff', color: '#111', borderColor: errors.email ? '#ef4444' : '#d1d5db' }}
        />
      </Field>

      <Field label="Password" error={errors.password?.message}>
        <div>
          <div className="flex items-center justify-between mb-1.5">
            <span />
            <button type="button" className="text-[12px] text-brand hover:underline">
              Forgot password?
            </button>
          </div>
          <PasswordInput register={register('password')} error={errors.password?.message} placeholder="••••••••" />
        </div>
      </Field>

      <label className="flex items-center gap-2.5 cursor-pointer select-none">
        <div className="relative">
          <input {...register('remember')} type="checkbox" className="peer sr-only" />
          <div className="h-4 w-4 rounded border-2 border-border peer-checked:border-brand peer-checked:bg-brand transition-colors flex items-center justify-center">
            <svg className="hidden peer-checked:block w-2.5 h-2 text-white" viewBox="0 0 10 8" fill="none">
              <path d="M1 4L3.5 6.5L9 1" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>
        </div>
        <span className="text-[13px]" style={{ color: '#555' }}>Remember me for 30 days</span>
      </label>

      {serverError && (
        <div className="rounded-xl px-4 py-3 text-[13px]" style={{ background: '#fef2f2', border: '1px solid #fca5a5', color: '#dc2626' }}>
          {serverError}
        </div>
      )}

      <button
        type="submit"
        disabled={isSubmitting}
        className="flex h-11 w-full items-center justify-center gap-2 rounded-xl bg-brand text-[14px] font-semibold text-white shadow-button transition-all hover:bg-brand-dark disabled:opacity-60 disabled:cursor-not-allowed mt-1"
      >
        {isSubmitting ? <Loader2 size={16} className="animate-spin" /> : 'Sign In'}
      </button>

      <div className="relative flex items-center gap-3 py-1">
        <div className="flex-1 h-px" style={{ background: '#e5e7eb' }} />
        <span className="text-[12px]" style={{ color: '#aaa' }}>or continue with</span>
        <div className="flex-1 h-px" style={{ background: '#e5e7eb' }} />
      </div>

      <div className="grid grid-cols-2 gap-3">
        <a
          href={`${API}/api/auth/google`}
          className="flex h-11 items-center justify-center gap-2.5 rounded-xl border text-[13px] font-medium transition-all hover:bg-gray-50"
          style={{ background: '#fff', borderColor: '#d1d5db', color: '#333' }}
        >
          <GoogleIcon />
          Google
        </a>
        <a
          href={`${API}/api/auth/github`}
          className="flex h-11 items-center justify-center gap-2.5 rounded-xl border text-[13px] font-medium transition-all hover:bg-gray-50"
          style={{ background: '#fff', borderColor: '#d1d5db', color: '#333' }}
        >
          <svg width="17" height="17" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2C6.477 2 2 6.477 2 12c0 4.418 2.865 8.166 6.839 9.489.5.092.682-.217.682-.482 0-.237-.009-.868-.013-1.703-2.782.604-3.369-1.342-3.369-1.342-.454-1.155-1.11-1.463-1.11-1.463-.908-.62.069-.608.069-.608 1.003.07 1.531 1.03 1.531 1.03.892 1.529 2.341 1.087 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.11-4.555-4.943 0-1.091.39-1.984 1.029-2.683-.103-.253-.446-1.27.098-2.647 0 0 .84-.269 2.75 1.025A9.578 9.578 0 0112 6.836c.85.004 1.705.115 2.504.337 1.909-1.294 2.747-1.025 2.747-1.025.546 1.377.203 2.394.1 2.647.64.699 1.028 1.592 1.028 2.683 0 3.842-2.339 4.687-4.566 4.935.359.309.678.919.678 1.852 0 1.336-.012 2.415-.012 2.743 0 .267.18.578.688.48C19.138 20.163 22 16.418 22 12c0-5.523-4.477-10-10-10z"/></svg>
          GitHub
        </a>
      </div>

      <p className="text-center text-[13px]" style={{ color: '#888' }}>
        Don't have an account?{' '}
        <button type="button" onClick={onSwitch} className="font-semibold text-brand hover:underline">
          Create account
        </button>
      </p>
    </form>
  )
}

function RegisterForm({ onSwitch }: { onSwitch: () => void }) {
  const navigate = useNavigate()
  const { setAuth } = useAuthStore()
  const [serverError, setServerError] = useState('')

  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<RegisterData>({
    resolver: zodResolver(registerSchema),
  })

  async function onSubmit(data: RegisterData) {
    setServerError('')
    try {
      const res = await fetch(`${API}/api/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(data),
      })
      const json = await res.json()
      if (!res.ok) throw new Error(json.error ?? 'Registration failed')
      setAuth(json.user, json.accessToken)
      navigate('/forms')
    } catch (e) {
      setServerError(e instanceof Error ? e.message : 'Something went wrong')
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
      <Field label="Full Name" error={errors.name?.message}>
        <input
          {...register('name')}
          type="text"
          placeholder="Alex Rivera"
          className="w-full rounded-xl border px-4 py-3 text-[14px] outline-none transition-all focus:ring-2 focus:ring-[#6c63ff]/20"
          style={{ background: '#fff', color: '#111', borderColor: errors.name ? '#ef4444' : '#d1d5db' }}
        />
      </Field>

      <Field label="Email Address" error={errors.email?.message}>
        <input
          {...register('email')}
          type="email"
          placeholder="name@company.com"
          className="w-full rounded-xl border px-4 py-3 text-[14px] outline-none transition-all focus:ring-2 focus:ring-[#6c63ff]/20"
          style={{ background: '#fff', color: '#111', borderColor: errors.email ? '#ef4444' : '#d1d5db' }}
        />
      </Field>

      <Field label="Password" error={errors.password?.message}>
        <PasswordInput register={register('password')} error={errors.password?.message} placeholder="Min. 8 characters" />
      </Field>

      {serverError && (
        <div className="rounded-xl px-4 py-3 text-[13px]" style={{ background: '#fef2f2', border: '1px solid #fca5a5', color: '#dc2626' }}>
          {serverError}
        </div>
      )}

      <button
        type="submit"
        disabled={isSubmitting}
        className="flex h-11 w-full items-center justify-center gap-2 rounded-xl bg-brand text-[14px] font-semibold text-white shadow-button transition-all hover:bg-brand-dark disabled:opacity-60 disabled:cursor-not-allowed mt-1"
      >
        {isSubmitting ? <Loader2 size={16} className="animate-spin" /> : 'Create Account'}
      </button>

      <div className="relative flex items-center gap-3 py-1">
        <div className="flex-1 h-px" style={{ background: '#e5e7eb' }} />
        <span className="text-[12px]" style={{ color: '#aaa' }}>or continue with</span>
        <div className="flex-1 h-px" style={{ background: '#e5e7eb' }} />
      </div>

      <div className="grid grid-cols-2 gap-3">
        <a
          href={`${API}/api/auth/google`}
          className="flex h-11 items-center justify-center gap-2.5 rounded-xl border text-[13px] font-medium transition-all hover:bg-gray-50"
          style={{ background: '#fff', borderColor: '#d1d5db', color: '#333' }}
        >
          <GoogleIcon />
          Google
        </a>
        <a
          href={`${API}/api/auth/github`}
          className="flex h-11 items-center justify-center gap-2.5 rounded-xl border text-[13px] font-medium transition-all hover:bg-gray-50"
          style={{ background: '#fff', borderColor: '#d1d5db', color: '#333' }}
        >
          <svg width="17" height="17" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2C6.477 2 2 6.477 2 12c0 4.418 2.865 8.166 6.839 9.489.5.092.682-.217.682-.482 0-.237-.009-.868-.013-1.703-2.782.604-3.369-1.342-3.369-1.342-.454-1.155-1.11-1.463-1.11-1.463-.908-.62.069-.608.069-.608 1.003.07 1.531 1.03 1.531 1.03.892 1.529 2.341 1.087 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.11-4.555-4.943 0-1.091.39-1.984 1.029-2.683-.103-.253-.446-1.27.098-2.647 0 0 .84-.269 2.75 1.025A9.578 9.578 0 0112 6.836c.85.004 1.705.115 2.504.337 1.909-1.294 2.747-1.025 2.747-1.025.546 1.377.203 2.394.1 2.647.64.699 1.028 1.592 1.028 2.683 0 3.842-2.339 4.687-4.566 4.935.359.309.678.919.678 1.852 0 1.336-.012 2.415-.012 2.743 0 .267.18.578.688.48C19.138 20.163 22 16.418 22 12c0-5.523-4.477-10-10-10z"/></svg>
          GitHub
        </a>
      </div>

      <p className="text-center text-[13px]" style={{ color: '#888' }}>
        Already have an account?{' '}
        <button type="button" onClick={onSwitch} className="font-semibold text-brand hover:underline">
          Sign in
        </button>
      </p>
    </form>
  )
}

export default function AuthPage() {
  const [tab, setTab] = useState<'login' | 'register'>('login')

  return (
    <div className="light flex min-h-screen" style={{ colorScheme: 'light', background: '#f4f5f7' }}>
      {/* Left panel */}
      <div className="relative hidden lg:flex lg:w-[42%] flex-col justify-between overflow-hidden bg-gradient-to-br from-[#6c63ff] via-[#7c74ff] to-[#9b8fff] p-12">
        {/* Background decoration */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-24 -left-24 h-96 w-96 rounded-full bg-white/10 blur-3xl" />
          <div className="absolute bottom-0 right-0 h-80 w-80 rounded-full bg-white/10 blur-3xl" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-64 w-64 rounded-full bg-white/5 blur-2xl" />
          {/* Grid dots */}
          <div className="absolute inset-0" style={{
            backgroundImage: 'radial-gradient(circle, rgba(255,255,255,0.15) 1px, transparent 1px)',
            backgroundSize: '32px 32px',
          }} />
        </div>

        <div className="relative">
          <Link to="/" className="group inline-flex items-center gap-2.5 transition-opacity hover:opacity-80">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-white/20 backdrop-blur-sm">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2"/>
                <rect x="9" y="3" width="6" height="4" rx="1"/>
                <path d="M9 12h6M9 16h4"/>
              </svg>
            </div>
            <span className="text-[17px] font-bold text-white tracking-tight">FormCraft</span>
          </Link>
        </div>

        <div className="relative">
          <h1 className="text-[38px] font-bold leading-[1.15] text-white">
            Design forms with{' '}
            <span className="relative inline-block">
              <span className="relative z-10">effortless flow.</span>
              <span className="absolute bottom-1 left-0 right-0 h-3 rounded-full bg-white/20" />
            </span>
          </h1>
          <p className="mt-5 text-[15px] leading-relaxed text-white/75">
            The next generation of data collection. A high-end editorial workspace built for digital products.
          </p>

          <div className="mt-8 flex flex-col gap-3">
            {FEATURES.map(f => (
              <div key={f.text} className="flex items-center gap-3">
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-white/15 text-[15px] backdrop-blur-sm">
                  {f.icon}
                </div>
                <span className="text-[14px] font-medium text-white/90">{f.text}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="relative rounded-2xl bg-white/10 backdrop-blur-sm border border-white/20 p-5">
          <p className="text-[13px] leading-relaxed text-white/85 italic">
            "FormCraft has fundamentally changed how we gather insights. The interface is not just a tool; it's an extension of our design team."
          </p>
          <div className="mt-3 flex items-center gap-2.5">
            <div className="h-7 w-7 rounded-full bg-white/30 flex items-center justify-center text-[11px] font-bold text-white">
              AR
            </div>
            <div>
              <p className="text-[12px] font-semibold text-white">Alex Rivera</p>
              <p className="text-[11px] text-white/60 uppercase tracking-wide">Design Lead at Flowstate</p>
            </div>
          </div>
        </div>
      </div>

      {/* Right panel */}
      <div className="flex flex-1 items-center justify-center px-6 py-12" style={{ background: '#f4f5f7' }}>
        <div className="w-full max-w-[420px]">
          {/* Back to home — desktop only (mobile has its own logo row) */}
          <div className="mb-5 hidden lg:flex">
            <Link
              to="/"
              className="inline-flex items-center gap-1.5 text-[13px] text-gray-500 transition-colors hover:text-gray-800"
            >
              <ArrowLeft size={13} />
              Back to home
            </Link>
          </div>

          {/* Mobile logo */}
          <div className="mb-8 flex items-center justify-between lg:hidden">
            <div className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-brand">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2"/>
                  <rect x="9" y="3" width="6" height="4" rx="1"/>
                </svg>
              </div>
              <span className="text-[16px] font-bold" style={{ color: '#111' }}>FormCraft</span>
            </div>
            <Link to="/" className="inline-flex items-center gap-1 text-[13px] text-gray-500 hover:text-gray-800 transition-colors">
              <ArrowLeft size={13} />
              Home
            </Link>
          </div>

          <div className="rounded-2xl border p-8 shadow-panel" style={{ background: '#fff', borderColor: '#e5e7eb' }}>
            {/* Tabs */}
            <div className="mb-7 flex rounded-xl p-1" style={{ background: '#f4f5f7' }}>
              {(['login', 'register'] as const).map(t => (
                <button
                  key={t}
                  onClick={() => setTab(t)}
                  className={[
                    'flex-1 rounded-lg py-2 text-[13px] font-semibold transition-all',
                    tab === t
                      ? 'shadow-card'
                      : '',
                  ].join(' ')}
                  style={tab === t
                    ? { background: '#fff', color: '#111' }
                    : { color: '#888' }
                  }
                >
                  {t === 'login' ? 'Login' : 'Register'}
                </button>
              ))}
            </div>

            <div className="mb-6">
              <h2 className="text-[22px] font-bold" style={{ color: '#111' }}>
                {tab === 'login' ? 'Welcome Back' : 'Create Account'}
              </h2>
              <p className="mt-1 text-[13px]" style={{ color: '#888' }}>
                {tab === 'login'
                  ? 'Enter your credentials to access your workspace.'
                  : 'Start building better forms today.'}
              </p>
            </div>

            {tab === 'login'
              ? <LoginForm onSwitch={() => setTab('register')} />
              : <RegisterForm onSwitch={() => setTab('login')} />
            }
          </div>
        </div>
      </div>
    </div>
  )
}
