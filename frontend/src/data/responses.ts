import { CheckCircle2, Clock, Users2 } from 'lucide-react'

export const RESPONSES_STATS = [
	{ label: 'TOTAL SUBMISSIONS', value: '1,284', delta: '+12%', deltaType: 'up' as const, icon: Users2 },
	{ label: 'AVG. TIME TO COMPLETE', value: '4m 12s', delta: '-2m', deltaType: 'up' as const, icon: Clock },
	{ label: 'COMPLETION RATE', value: '94.2%', delta: 'Optimal', deltaType: 'neutral' as const, icon: CheckCircle2 },
]

export const RESPONSES = [
	{ id: '1', date: 'Oct 24, 2023', time: '10:42 AM', name: 'Alex Sterling', initials: 'AS', color: 'bg-brand-muted text-brand', email: 'alex.sterling@example.com', score: 5 },
	{ id: '2', date: 'Oct 23, 2023', time: '03:15 PM', name: 'Maya Kincaid', initials: 'MK', color: 'bg-success-light text-success', email: 'maya.k@webflow.io', score: 4 },
	{ id: '3', date: 'Oct 23, 2023', time: '09:58 AM', name: 'Jordan Reed', initials: 'oR', color: 'bg-danger-light text-danger', email: 'j.reed@techcorp.com', score: 3 },
	{ id: '4', date: 'Oct 22, 2023', time: '11:12 PM', name: 'Lana Vance', initials: 'LV', color: 'bg-success-light text-success', email: 'lana_v@creative.studio', score: 5 },
]
