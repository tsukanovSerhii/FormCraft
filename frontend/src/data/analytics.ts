import { BarChart2, CheckCircle2, TrendingUp, Users2 } from 'lucide-react'

export const ANALYTICS_STATS = [
	{ label: 'Total Forms', value: '24', delta: '+12%', deltaType: 'up' as const, icon: BarChart2 },
	{ label: 'Total Responses', value: '4,821', delta: '+28%', deltaType: 'up' as const, icon: Users2 },
	{ label: 'Completion Rate', value: '76.4%', delta: '-2%', deltaType: 'down' as const, icon: CheckCircle2 },
	{ label: 'Active Users', value: '1,029', delta: '+5%', deltaType: 'up' as const, icon: TrendingUp },
]

export const TOP_FORMS = [
	{ name: 'Customer Feedback Survey', responses: 1284, rate: '94.2%', updated: '2 hours ago' },
	{ name: 'Job Application Form', responses: 573, rate: '81.5%', updated: '1 day ago' },
	{ name: 'Product Waitlist', responses: 1203, rate: '88.0%', updated: '3 days ago' },
]

export const RECENT_ACTIVITY = [
	{ name: 'Alex Rivera', action: 'submitted "Customer Survey"', time: '4 minutes ago', initials: 'AR', color: 'bg-brand-muted text-brand' },
	{ name: 'Sam Chen', action: 'submitted "Job Application"', time: '18 minutes ago', initials: 'SC', color: 'bg-success-light text-success' },
	{ name: 'Mia Torres', action: 'submitted "Feedback Form"', time: '34 minutes ago', initials: 'MT', color: 'bg-danger-light text-danger' },
]
