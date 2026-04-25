import sanitizeHtml from 'sanitize-html'

const TEXT_OPTIONS: sanitizeHtml.IOptions = {
  allowedTags: [],
  allowedAttributes: {},
}

export function sanitizeText(value: unknown): string {
  if (typeof value !== 'string') return String(value ?? '')
  return sanitizeHtml(value, TEXT_OPTIONS).trim()
}

export function sanitizeResponseData(data: unknown): Record<string, unknown> {
  if (!data || typeof data !== 'object' || Array.isArray(data)) return {}

  const result: Record<string, unknown> = {}
  for (const [key, value] of Object.entries(data as Record<string, unknown>)) {
    if (Array.isArray(value)) {
      result[key] = value.map(v => (typeof v === 'string' ? sanitizeText(v) : v))
    } else if (typeof value === 'string') {
      result[key] = sanitizeText(value)
    } else {
      result[key] = value
    }
  }
  return result
}
