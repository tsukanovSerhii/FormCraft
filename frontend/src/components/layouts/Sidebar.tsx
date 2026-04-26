import {
	BarChart2,
	FileText,
	HelpCircle,
	LogOut,
	MessageSquare,
	Settings,
	TrendingUp
} from 'lucide-react'
import { Link, NavLink, useNavigate } from 'react-router'
import { authApi } from '@/api/auth'
import { useAuthStore } from '@/store/authStore'
import { WorkspaceSwitcher } from '@/components/ui/WorkspaceSwitcher'

const navItems = [
	{ label: 'Forms', icon: FileText, to: '/forms' },
	{ label: 'Responses', icon: BarChart2, to: '/responses' },
	{ label: 'Analytics', icon: TrendingUp, to: '/analytics' },
]

const bottomNavItems = [
	{ label: 'Settings', icon: Settings, to: '/settings' },
	{ label: 'Support', icon: HelpCircle, to: '/support' },
	{ label: 'Feedback', icon: MessageSquare, to: '/feedback' },
]

function UserAvatar({ name, avatarUrl }: { name: string; avatarUrl?: string | null }) {
	const initials = name.split(' ').map(p => p[0]).join('').toUpperCase().slice(0, 2)
	if (avatarUrl) {
		return <img src={avatarUrl} alt={name} className="h-7 w-7 rounded-full object-cover shrink-0" />
	}
	return (
		<div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-brand text-[11px] font-bold text-white">
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
		<aside className="flex h-full w-52 shrink-0 flex-col border-r border-border bg-surface">
			{/* Logo */}
			<div className="flex h-13 items-center px-4">
				<Link to="/forms" className="flex items-center gap-2">
					<div className="flex h-6 w-6 items-center justify-center rounded-sm bg-brand">
						<svg width="14" height="14" viewBox="0 0 16 16" fill="none">
							<rect x="2" y="2" width="5" height="5" rx="1" fill="white" />
							<rect x="9" y="2" width="5" height="5" rx="1" fill="white" fillOpacity="0.6" />
							<rect x="2" y="9" width="5" height="5" rx="1" fill="white" fillOpacity="0.6" />
							<rect x="9" y="9" width="5" height="5" rx="1" fill="white" />
						</svg>
					</div>
					<span className="text-[14px] font-bold tracking-tight text-text-primary">FormCraft</span>
				</Link>
			</div>

			{/* Workspace switcher */}
			<WorkspaceSwitcher />

			{/* Main nav */}
			<nav className="flex flex-col gap-0.5 px-2 pt-1">
				{navItems.map(({ label, icon: Icon, to }) => (
					<NavLink
						key={to}
						to={to}
						className={({ isActive }) =>
							[
								'flex items-center gap-2.5 rounded-md px-3 py-2 text-[13px] font-medium transition-colors',
								isActive
									? 'bg-brand-muted text-brand'
									: 'text-text-secondary hover:bg-surface-secondary hover:text-text-primary',
							].join(' ')
						}
					>
						<Icon size={15} />
						{label}
					</NavLink>
				))}
			</nav>

			{/* Bottom nav + user */}
			<div className="mt-auto flex flex-col gap-0.5 px-2 pb-3">
				{bottomNavItems.map(({ label, icon: Icon, to }) => (
					<NavLink
						key={to}
						to={to}
						className={({ isActive }) =>
							[
								'flex items-center gap-2.5 rounded-md px-3 py-2 text-[13px] font-medium transition-colors',
								isActive
									? 'bg-brand-muted text-brand'
									: 'text-text-secondary hover:bg-surface-secondary hover:text-text-primary',
							].join(' ')
						}
					>
						<Icon size={15} />
						{label}
					</NavLink>
				))}

				{user && (
					<div className="mt-2 flex items-center gap-2 rounded-md px-2 py-2">
						<UserAvatar name={user.name} avatarUrl={user.avatarUrl} />
						<div className="min-w-0 flex-1">
							<p className="truncate text-[12px] font-medium text-text-primary">{user.name}</p>
						</div>
						<button
							onClick={handleLogout}
							title="Log out"
							className="flex h-6 w-6 shrink-0 items-center justify-center rounded-md text-text-muted transition-colors hover:text-text-primary"
						>
							<LogOut size={13} />
						</button>
					</div>
				)}
			</div>
		</aside>
	)
}
