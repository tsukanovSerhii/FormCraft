import type { FieldCondition } from '@/types/form'

export function evaluateCondition(
  condition: FieldCondition | undefined,
  values: Record<string, unknown>
): boolean {
  if (!condition) return true

  const raw = values[condition.fieldId]
  const val = Array.isArray(raw) ? raw.join(', ') : String(raw ?? '')

  switch (condition.operator) {
    case 'equals':     return val === condition.value
    case 'not_equals': return val !== condition.value
    case 'contains':   return val.toLowerCase().includes(condition.value.toLowerCase())
    case 'not_empty':  return val.trim().length > 0
    default:           return true
  }
}
