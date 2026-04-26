import { useState } from 'react'
import { Link } from 'react-router-dom'
import { LogoMark } from '@/components/landing/LandingIcons'
import { LoginForm } from '@/components/auth/LoginForm'
import { RegisterForm } from '@/components/auth/RegisterForm'

export default function AuthPage() {
  const [tab, setTab] = useState<'login' | 'register'>('login')

  return (
    <div className="flex min-h-screen bg-land-bg">
      {/* Left panel */}
      <div className="relative hidden lg:flex lg:w-[400px] shrink-0 flex-col justify-between overflow-hidden bg-land-bg3 p-12">
        <div
          className="absolute -top-25 -left-25 w-[350px] h-[350px] rounded-full pointer-events-none"
          style={{ background: 'rgba(106,99,255,.15)', filter: 'blur(70px)' }}
        />
        <div className="relative flex items-center gap-2.5">
          <LogoMark />
          <span className="font-bold text-[17px] tracking-[-0.5px] text-land-text">FormCraft</span>
        </div>
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

      {/* Right panel */}
      <div className="flex flex-1 items-center justify-center px-6 py-12">
        <div className="w-full max-w-[440px]">
          <div className="mb-5 hidden lg:flex">
            <Link to="/" className="inline-flex items-center gap-1.5 text-[13px] text-land-text3 hover:text-land-text2 transition-colors">
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M19 12H5"/><path d="M12 19l-7-7 7-7"/>
              </svg>
              Back to home
            </Link>
          </div>

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

          <div
            className="rounded-[24px] border border-land-border overflow-hidden"
            style={{ boxShadow: '0 1px 0 rgba(255,255,255,0.04) inset,0 16px 40px rgba(0,0,0,0.4)', background: 'var(--color-land-bg2,#111318)' }}
          >
            <div className="h-[5px]" style={{ background: 'linear-gradient(90deg,#4e45e2,#6a63ff,#c084fc)' }} />
            <div className="p-8 pt-7">
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
