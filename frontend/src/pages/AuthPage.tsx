import { zodResolver } from '@hookform/resolvers/zod'
import { Eye, EyeOff, Loader2 } from 'lucide-react'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { Link, useNavigate } from 'react-router-dom'
import { z } from 'zod'
import { useAuthStore } from '@/store/authStore'
import { LogoMark } from '@/components/landing/LandingIcons'

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

/* ── Shared sub-components ───────────────────────────────────── */

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

function GitHubIcon() {
  return (
    <svg width="17" height="17" viewBox="0 0 24 24" fill="currentColor">
      <path d="M12 2C6.477 2 2 6.477 2 12c0 4.418 2.865 8.166 6.839 9.489.5.092.682-.217.682-.482 0-.237-.009-.868-.013-1.703-2.782.604-3.369-1.342-3.369-1.342-.454-1.155-1.11-1.463-1.11-1.463-.908-.62.069-.608.069-.608 1.003.07 1.531 1.03 1.531 1.03.892 1.529 2.341 1.087 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.11-4.555-4.943 0-1.091.39-1.984 1.029-2.683-.103-.253-.446-1.27.098-2.647 0 0 .84-.269 2.75 1.025A9.578 9.578 0 0112 6.836c.85.004 1.705.115 2.504.337 1.909-1.294 2.747-1.025 2.747-1.025.546 1.377.203 2.394.1 2.647.64.699 1.028 1.592 1.028 2.683 0 3.842-2.339 4.687-4.566 4.935.359.309.678.919.678 1.852 0 1.336-.012 2.415-.012 2.743 0 .267.18.578.688.48C19.138 20.163 22 16.418 22 12c0-5.523-4.477-10-10-10z"/>
    </svg>
  )
}

function InputField({ label, error, children }: { label: string; error?: string; children: React.ReactNode }) {
  return (
    <div className="flex flex-col gap-1.5">
      <label className="text-[12px] font-bold tracking-[0.04em] uppercase text-land-text2">{label}</label>
      {children}
      {error && <p className="text-[12px] text-red-400 font-medium">{error}</p>}
    </div>
  )
}

function TextInput({ hasError, ...props }: React.InputHTMLAttributes<HTMLInputElement> & { hasError?: boolean }) {
  return (
    <input
      {...props}
      className={[
        'w-full bg-land-bg3 rounded-lg px-4 py-3 text-[15px] text-land-text outline-none transition-all border-[1.5px] placeholder:text-land-text3',
        'focus:bg-land-bg2 focus:border-land-accent',
        hasError ? 'border-red-500 focus:border-red-500' : 'border-transparent',
      ].join(' ')}
      style={{ boxShadow: hasError ? undefined : undefined }}
    />
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

function OAuthButtons() {
  return (
    <>
      <div className="flex items-center gap-3 py-1">
        <div className="flex-1 h-px bg-land-border" />
        <span className="text-[13px] text-land-text3">or continue with</span>
        <div className="flex-1 h-px bg-land-border" />
      </div>
      <div className="grid grid-cols-2 gap-3">
        <a
          href={`${API}/api/auth/google`}
          className="flex h-11 items-center justify-center gap-2.5 rounded-lg bg-land-bg3 border border-land-border text-[13px] font-semibold text-land-text hover:border-land-border2 hover:bg-land-bg transition-all"
        >
          <GoogleIcon /> Google
        </a>
        <a
          href={`${API}/api/auth/github`}
          className="flex h-11 items-center justify-center gap-2.5 rounded-lg bg-land-bg3 border border-land-border text-[13px] font-semibold text-land-text hover:border-land-border2 hover:bg-land-bg transition-all"
        >
          <GitHubIcon /> GitHub
        </a>
      </div>
    </>
  )
}

/* ── Login form ──────────────────────────────────────────────── */

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

/* ── Register form ───────────────────────────────────────────── */

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
      <InputField label="Full Name" error={errors.name?.message}>
        <TextInput
          {...register('name')}
          type="text"
          placeholder="Alex Johnson"
          hasError={!!errors.name}
        />
      </InputField>

      <InputField label="Email Address" error={errors.email?.message}>
        <TextInput
          {...register('email')}
          type="email"
          placeholder="name@company.com"
          hasError={!!errors.email}
        />
      </InputField>

      <InputField label="Password" error={errors.password?.message}>
        <PasswordInput register={register('password')} error={errors.password?.message} placeholder="Min. 8 characters" />
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
        {isSubmitting ? <Loader2 size={16} className="animate-spin" /> : 'Create Account'}
      </button>

      <OAuthButtons />

      <p className="text-center text-[13px] text-land-text2">
        Already have an account?{' '}
        <button type="button" onClick={onSwitch} className="font-bold text-land-accent hover:text-land-accent3 transition-colors">
          Sign in
        </button>
      </p>
    </form>
  )
}

/* ── Page ────────────────────────────────────────────────────── */

export default function AuthPage() {
  const [tab, setTab] = useState<'login' | 'register'>('login')

  return (
    <div className="flex min-h-screen bg-land-bg">
      {/* ── Left panel ── */}
      <div className="relative hidden lg:flex lg:w-[400px] shrink-0 flex-col justify-between overflow-hidden bg-land-bg3 p-12">
        {/* Purple glow orb */}
        <div
          className="absolute -top-25 -left-25 w-[350px] h-[350px] rounded-full pointer-events-none"
          style={{ background: 'rgba(106,99,255,.15)', filter: 'blur(70px)' }}
        />

        {/* Logo */}
        <div className="relative flex items-center gap-2.5">
          <LogoMark />
          <span className="font-bold text-[17px] tracking-[-0.5px] text-land-text">FormCraft</span>
        </div>

        {/* Headline */}
        <div className="relative">
          <h2
            className="font-extrabold text-[34px] leading-[1.15] text-land-text mb-4"
            style={{ fontFamily: 'Manrope,sans-serif', letterSpacing: '-1.5px' }}
          >
            Design forms with effortless flow.
          </h2>
          <p className="text-[15px] text-land-text2 leading-[1.7]">
            Experience the next generation of data collection.
          </p>
        </div>

        {/* Testimonial card */}
        <div className="relative rounded-[12px] border border-land-border2 bg-[rgba(106,99,255,0.04)] p-5 backdrop-blur-sm">
          <p className="text-[13px] text-land-text2 leading-[1.7] italic mb-3">
            "FormCraft has fundamentally changed how we gather insights."
          </p>
          <div className="flex items-center gap-2.5">
            <div
              className="w-7 h-7 rounded-full flex items-center justify-center text-[11px] font-bold text-white"
              style={{ background: 'linear-gradient(135deg,#4e45e2,#6a63ff)' }}
            >
              AR
            </div>
            <div>
              <p className="text-[12px] font-bold text-land-text">Alex Rivera</p>
              <p className="text-[11px] text-land-text3 uppercase tracking-wide">Design Lead, Flowstate</p>
            </div>
          </div>
        </div>
      </div>

      {/* ── Right panel ── */}
      <div className="flex flex-1 items-center justify-center px-6 py-12">
        <div className="w-full max-w-[440px]">

          {/* Back link — desktop */}
          <div className="mb-5 hidden lg:flex">
            <Link to="/" className="inline-flex items-center gap-1.5 text-[13px] text-land-text3 hover:text-land-text2 transition-colors">
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M19 12H5"/><path d="M12 19l-7-7 7-7"/>
              </svg>
              Back to home
            </Link>
          </div>

          {/* Mobile logo + back */}
          <div className="mb-8 flex items-center justify-between lg:hidden">
            <div className="flex items-center gap-2.5">
              <LogoMark />
              <span className="font-bold text-[16px] text-land-text">FormCraft</span>
            </div>
            <Link to="/" className="inline-flex items-center gap-1 text-[13px] text-land-text3 hover:text-land-text2 transition-colors">
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M19 12H5"/><path d="M12 19l-7-7 7-7"/>
              </svg>
              Home
            </Link>
          </div>

          {/* Card */}
          <div
            className="rounded-[24px] border border-land-border overflow-hidden"
            style={{ boxShadow: '0 1px 0 rgba(255,255,255,0.04) inset,0 16px 40px rgba(0,0,0,0.4)', background: 'var(--color-land-bg2,#111318)' }}
          >
            {/* Gradient top bar */}
            <div className="h-[5px]" style={{ background: 'linear-gradient(90deg,#4e45e2,#6a63ff,#c084fc)' }} />

            <div className="p-8 pt-7">
              {/* Tabs */}
              <div className="flex border-b border-land-border mb-8 gap-0">
                {(['login', 'register'] as const).map(t => (
                  <button
                    key={t}
                    onClick={() => setTab(t)}
                    className={[
                      'pb-3.5 mr-6 text-[14px] font-bold border-b-2 -mb-px transition-all',
                      tab === t
                        ? 'border-land-accent text-land-accent'
                        : 'border-transparent text-land-text2 hover:text-land-text',
                    ].join(' ')}
                  >
                    {t === 'login' ? 'Login' : 'Register'}
                  </button>
                ))}
              </div>

              {/* Heading */}
              <div className="mb-6">
                <h3
                  className="font-bold text-[26px] text-land-text mb-1.5"
                  style={{ fontFamily: 'Manrope,sans-serif', letterSpacing: '-0.7px' }}
                >
                  {tab === 'login' ? 'Welcome Back' : 'Create account'}
                </h3>
                <p className="text-[14px] text-land-text2">
                  {tab === 'login'
                    ? 'Enter your credentials to access your workspace.'
                    : 'Start building beautiful forms today.'}
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
    </div>
  )
}
