import { Bell, HelpCircle } from 'lucide-react'
import { NavLink } from 'react-router'
import { IconButton } from '@/components/ui'

const tabs = [
	{ label: 'Dashboard', to: '/forms' },
	{ label: 'Templates', to: '/templates' },
]

export default function AppTopBar() {
	return (
		<header className="flex h-14 shrink-0 items-center justify-between border-b border-border bg-surface px-6">
			<nav className="flex items-center gap-1">
				{tabs.map(({ label, to }) => (
					<NavLink
						key={to}
						to={to}
						className={({ isActive }) =>
							[
								'relative px-3 py-1.5 text-[13px] font-medium transition-all',
								isActive
									? 'text-brand after:absolute after:inset-x-0 after:-bottom-3 after:h-0.5 after:rounded-full after:bg-brand'
									: 'text-text-secondary hover:text-text-primary',
							].join(' ')
						}
					>
						{label}
					</NavLink>
				))}
			</nav>

			<div className="flex items-center gap-2">
				<IconButton><HelpCircle size={17} /></IconButton>
				<IconButton><Bell size={17} /></IconButton>

				{/* Avatar */}
				<div className="ml-1 flex h-8 w-8 items-center justify-center rounded-full bg-brand text-[12px] font-bold text-white">
					F
				</div>
			</div>
		</header>
	)
}
