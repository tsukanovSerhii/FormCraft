import { BarChart2, CheckSquare, FileText, MessageSquare, Users2 } from 'lucide-react'

export const TEMPLATE_CATEGORIES = ['All', 'Feedback', 'Registration', 'Survey', 'Application']

export const TEMPLATES = [
	{ id: '1', title: 'Customer Feedback Survey', category: 'Feedback', fields: 8, icon: MessageSquare, color: 'bg-brand-muted text-brand' },
	{ id: '2', title: 'Event Registration', category: 'Registration', fields: 12, icon: Users2, color: 'bg-success-light text-success' },
	{ id: '3', title: 'Job Application Form', category: 'Application', fields: 15, icon: FileText, color: 'bg-danger-light text-danger' },
	{ id: '4', title: 'Product Survey', category: 'Survey', fields: 6, icon: BarChart2, color: 'bg-brand-muted text-brand' },
	{ id: '5', title: 'Bug Report Form', category: 'Feedback', fields: 7, icon: CheckSquare, color: 'bg-success-light text-success' },
	{ id: '6', title: 'Contact Us Form', category: 'Feedback', fields: 4, icon: MessageSquare, color: 'bg-danger-light text-danger' },
]
