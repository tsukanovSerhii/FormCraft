import { GoogleIcon, GitHubIcon } from './AuthIcons'

const API = import.meta.env.VITE_API_URL ?? 'http://localhost:3000'

export function OAuthButtons() {
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
