import { BarChart2, CheckSquare, FileText, MessageSquare, Users2 } from 'lucide-react'
import { uid } from '@/lib/uid'
import type { FormField } from '@/types/form'

export const TEMPLATE_CATEGORIES = ['All', 'Feedback', 'Registration', 'Survey', 'Application']

export interface Template {
  id: string
  title: string
  description: string
  category: string
  icon: typeof MessageSquare
  color: string
  fields: FormField[]
}

export const TEMPLATES: Template[] = [
  {
    id: '1',
    title: 'Customer Feedback Survey',
    description: 'Collect structured feedback from your customers.',
    category: 'Feedback',
    icon: MessageSquare,
    color: 'bg-brand-muted text-brand',
    fields: [
      { id: uid(), type: 'text', label: 'Full Name', placeholder: 'Your name', required: true },
      { id: uid(), type: 'email', label: 'Email Address', placeholder: 'name@example.com', required: true },
      { id: uid(), type: 'rating', label: 'Overall Satisfaction', required: true, ratingMax: 5 },
      { id: uid(), type: 'radio', label: 'How did you hear about us?', required: false, options: [
        { id: uid(), label: 'Social Media' },
        { id: uid(), label: 'Search Engine' },
        { id: uid(), label: 'Friend / Colleague' },
        { id: uid(), label: 'Advertisement' },
      ]},
      { id: uid(), type: 'checkbox', label: 'What did you like?', required: false, options: [
        { id: uid(), label: 'Product Quality' },
        { id: uid(), label: 'Customer Support' },
        { id: uid(), label: 'Pricing' },
        { id: uid(), label: 'Delivery Speed' },
      ]},
      { id: uid(), type: 'textarea', label: 'Additional Comments', placeholder: 'Share your thoughts...', required: false },
    ],
  },
  {
    id: '2',
    title: 'Event Registration',
    description: 'Register attendees for your upcoming event.',
    category: 'Registration',
    icon: Users2,
    color: 'bg-success-light text-success',
    fields: [
      { id: uid(), type: 'text', label: 'First Name', placeholder: 'John', required: true },
      { id: uid(), type: 'text', label: 'Last Name', placeholder: 'Doe', required: true },
      { id: uid(), type: 'email', label: 'Email Address', placeholder: 'john@example.com', required: true },
      { id: uid(), type: 'phone', label: 'Phone Number', placeholder: '+1 555 000 0000', required: false },
      { id: uid(), type: 'select', label: 'Ticket Type', required: true, options: [
        { id: uid(), label: 'General Admission' },
        { id: uid(), label: 'VIP' },
        { id: uid(), label: 'Online Access' },
      ]},
      { id: uid(), type: 'number', label: 'Number of Guests', placeholder: '1', required: false },
      { id: uid(), type: 'radio', label: 'Dietary Preference', required: false, options: [
        { id: uid(), label: 'No Restrictions' },
        { id: uid(), label: 'Vegetarian' },
        { id: uid(), label: 'Vegan' },
        { id: uid(), label: 'Gluten-free' },
      ]},
      { id: uid(), type: 'textarea', label: 'Special Requests', placeholder: 'Anything we should know?', required: false },
    ],
  },
  {
    id: '3',
    title: 'Job Application Form',
    description: 'Streamline your hiring process with a structured form.',
    category: 'Application',
    icon: FileText,
    color: 'bg-danger-light text-danger',
    fields: [
      { id: uid(), type: 'text', label: 'Full Name', placeholder: 'Your full name', required: true },
      { id: uid(), type: 'email', label: 'Email Address', placeholder: 'you@example.com', required: true },
      { id: uid(), type: 'phone', label: 'Phone Number', placeholder: '+1 555 000 0000', required: true },
      { id: uid(), type: 'text', label: 'Current Job Title', placeholder: 'e.g. Senior Designer', required: false },
      { id: uid(), type: 'select', label: 'Position Applying For', required: true, options: [
        { id: uid(), label: 'Frontend Developer' },
        { id: uid(), label: 'Backend Developer' },
        { id: uid(), label: 'Product Designer' },
        { id: uid(), label: 'Product Manager' },
      ]},
      { id: uid(), type: 'number', label: 'Years of Experience', placeholder: '3', required: true },
      { id: uid(), type: 'checkbox', label: 'Skills', required: false, options: [
        { id: uid(), label: 'TypeScript' },
        { id: uid(), label: 'React' },
        { id: uid(), label: 'Node.js' },
        { id: uid(), label: 'PostgreSQL' },
        { id: uid(), label: 'Docker' },
      ]},
      { id: uid(), type: 'text', label: 'Portfolio / LinkedIn URL', placeholder: 'https://', required: false },
      { id: uid(), type: 'file', label: 'Upload CV', required: true },
      { id: uid(), type: 'textarea', label: 'Cover Letter', placeholder: 'Tell us about yourself...', required: false },
    ],
  },
  {
    id: '4',
    title: 'Product Survey',
    description: 'Understand how users interact with your product.',
    category: 'Survey',
    icon: BarChart2,
    color: 'bg-brand-muted text-brand',
    fields: [
      { id: uid(), type: 'radio', label: 'How often do you use our product?', required: true, options: [
        { id: uid(), label: 'Daily' },
        { id: uid(), label: 'Weekly' },
        { id: uid(), label: 'Monthly' },
        { id: uid(), label: 'Rarely' },
      ]},
      { id: uid(), type: 'rating', label: 'How would you rate the overall experience?', required: true, ratingMax: 5 },
      { id: uid(), type: 'checkbox', label: 'Which features do you use most?', required: false, options: [
        { id: uid(), label: 'Form Builder' },
        { id: uid(), label: 'Analytics' },
        { id: uid(), label: 'Templates' },
        { id: uid(), label: 'Responses' },
      ]},
      { id: uid(), type: 'radio', label: 'Would you recommend us to a friend?', required: true, options: [
        { id: uid(), label: 'Definitely' },
        { id: uid(), label: 'Probably' },
        { id: uid(), label: 'Not sure' },
        { id: uid(), label: 'No' },
      ]},
      { id: uid(), type: 'textarea', label: 'What can we improve?', placeholder: 'Your honest feedback...', required: false },
    ],
  },
  {
    id: '5',
    title: 'Bug Report Form',
    description: 'Let users report issues in a structured way.',
    category: 'Feedback',
    icon: CheckSquare,
    color: 'bg-success-light text-success',
    fields: [
      { id: uid(), type: 'text', label: 'Your Name', placeholder: 'Optional', required: false },
      { id: uid(), type: 'email', label: 'Email Address', placeholder: 'For follow-up', required: false },
      { id: uid(), type: 'text', label: 'Bug Title', placeholder: 'Short description of the issue', required: true },
      { id: uid(), type: 'select', label: 'Severity', required: true, options: [
        { id: uid(), label: 'Critical — App is unusable' },
        { id: uid(), label: 'High — Major feature broken' },
        { id: uid(), label: 'Medium — Minor feature broken' },
        { id: uid(), label: 'Low — Cosmetic issue' },
      ]},
      { id: uid(), type: 'textarea', label: 'Steps to Reproduce', placeholder: '1. Go to...\n2. Click on...', required: true },
      { id: uid(), type: 'textarea', label: 'Expected vs Actual Behaviour', placeholder: 'What you expected vs what happened', required: true },
      { id: uid(), type: 'file', label: 'Screenshot (optional)', required: false },
    ],
  },
  {
    id: '6',
    title: 'Contact Us Form',
    description: 'Simple contact form for your website or app.',
    category: 'Feedback',
    icon: MessageSquare,
    color: 'bg-danger-light text-danger',
    fields: [
      { id: uid(), type: 'text', label: 'Full Name', placeholder: 'Your name', required: true },
      { id: uid(), type: 'email', label: 'Email Address', placeholder: 'you@example.com', required: true },
      { id: uid(), type: 'select', label: 'Subject', required: true, options: [
        { id: uid(), label: 'General Inquiry' },
        { id: uid(), label: 'Technical Support' },
        { id: uid(), label: 'Billing' },
        { id: uid(), label: 'Partnership' },
      ]},
      { id: uid(), type: 'textarea', label: 'Message', placeholder: 'How can we help you?', required: true },
    ],
  },
]
