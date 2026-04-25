import {
	BarChart2,
	FileText,
	HelpCircle,
	LogOut,
	MessageSquare,
	Plus,
	Settings,
	TrendingUp
} from 'lucide-react'
import { Link, NavLink, useNavigate } from 'react-router'
import { authApi } from '@/api/auth'
import { useAuthStore } from '@/store/authStore'

const navItems = [
	{ label: 'Forms', icon: FileText, to: '/forms' },
	{ label: 'Responses', icon: BarChart2, to: '/responses' },
	{ label: 'Analytics', icon: TrendingUp, to: '/analytics' },
	{ label: 'Settings', icon: Settings, to: '/settings' }
]

const bottomItems = [
	{ label: 'Support', icon: HelpCircle, to: '/support' },
	{ label: 'Feedback', icon: MessageSquare, to: '/feedback' }
]

function UserAvatar({ name, avatarUrl }: { name: string; avatarUrl?: string | null }) {
	const initials = name.split(' ').map(p => p[0]).join('').toUpperCase().slice(0, 2)
	if (avatarUrl) {
		return <img src={avatarUrl} alt={name} className="h-8 w-8 rounded-full object-cover" />
	}
	return (
		<div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-brand text-[12px] font-bold text-white">
			{initials}
		</div>
	)
}

export default function Sidebar() {
	const { user, clearAuth } = useAuthStore()
	const navigate = useNavigate()

	async function handleLogout() {
		try { await authApi.logout() } catch { /* ignore */ }
		clearAuth()
		navigate('/login')
	}

	return (
		<aside className="flex h-full w-56 shrink-0 flex-col border-r border-border bg-surface">
			{/* Logo */}
			<div className="flex h-14 items-center px-5">
				<Link to="/forms" className="flex items-center gap-2">
					<div className="flex h-7 w-7 items-center justify-center rounded-sm bg-brand">
						<svg width="16" height="16" viewBox="0 0 16 16" fill="none">
							<rect x="2" y="2" width="5" height="5" rx="1" fill="white" />
							<rect x="9" y="2" width="5" height="5" rx="1" fill="white" fillOpacity="0.6" />
							<rect x="2" y="9" width="5" height="5" rx="1" fill="white" fillOpacity="0.6" />
							<rect x="9" y="9" width="5" height="5" rx="1" fill="white" />
						</svg>
					</div>
					<span className="text-[15px] font-bold tracking-tight text-text-primary">
						FormCraft
					</span>
				</Link>
			</div>

			{/* New Form button */}
			<div className="mx-3 mb-3">
				<Link
					to="/forms"
					className="flex h-8 w-full items-center justify-center gap-1.5 rounded-md bg-brand text-[12px] font-semibold text-white shadow-button transition-colors hover:bg-brand-dark"
				>
					<Plus size={13} />
					New Form
				</Link>
			</div>

			{/* Main nav */}
			<nav className="flex flex-col gap-0.5 px-3">
				{navItems.map(({ label, icon: Icon, to }) => (
					<NavLink
						key={to}
						to={to}
						className={({ isActive }) =>
							[
								'flex items-center gap-2.5 rounded-md px-3 py-2 text-[13px] font-medium transition-colors',
								isActive
									? 'bg-brand-muted text-brand'
									: 'text-text-secondary hover:bg-surface-secondary hover:text-text-primary'
							].join(' ')
						}
					>
						<Icon size={16} />
						{label}
					</NavLink>
				))}
			</nav>

			{/* Bottom items */}
			<div className="mt-auto flex flex-col gap-0.5 px-3 pb-2">
				{bottomItems.map(({ label, icon: Icon, to }) => (
					<NavLink
						key={to}
						to={to}
						className="flex items-center gap-2.5 rounded-md px-3 py-2 text-[13px] font-medium text-text-secondary transition-colors hover:bg-surface-secondary hover:text-text-primary"
					>
						<Icon size={16} />
						{label}
					</NavLink>
				))}
			</div>

			{/* User + logout */}
			{user && (
				<div className="mx-3 mb-3 flex items-center gap-2 rounded-lg border border-border bg-surface-secondary p-2.5">
					<UserAvatar name={user.name} avatarUrl={user.avatarUrl} />
					<div className="min-w-0 flex-1">
						<p className="truncate text-[12px] font-semibold text-text-primary">{user.name}</p>
						<p className="truncate text-[11px] text-text-muted">{user.email}</p>
					</div>
<button
						onClick={handleLogout}
						title="Log out"
						className="flex h-7 w-7 shrink-0 items-center justify-center rounded-md text-text-muted transition-colors hover:bg-surface hover:text-text-primary"
					>
						<LogOut size={14} />
					</button>
				</div>
			)}
		</aside>
	)
}
