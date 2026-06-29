// Strip HTML tags and dangerous characters from text before storing in Firestore.
// React escapes text by default, but data can be rendered via dangerouslySetInnerHTML
// (e.g. RichTextEditor output) so we sanitize at write time as a defense-in-depth measure.

export function sanitizeText(value, maxLength = 200) {
  if (typeof value !== 'string') return ''
  return value
    .replace(/<[^>]*>/g, '')                    // strip HTML tags
    .replace(/[\x00-\x08\x0B\x0C\x0E-\x1F\x7F]/g, '') // strip control chars
    .trim()
    .slice(0, maxLength)
}

export function sanitizePhone(value) {
  if (typeof value !== 'string') return ''
  // Keep only digits, +, -, (, ), spaces
  return value.replace(/[^\d+\-() ]/g, '').trim().slice(0, 20)
}

// Validates Indonesian WhatsApp number format (08xx or 628xx)
export function isValidWhatsApp(value) {
  const digits = value.replace(/\D/g, '')
  return /^(08|628)\d{8,12}$/.test(digits)
}

// Strips HTML from server-received strings (for API routes)
export function sanitizeApiInput(value, maxLength = 500) {
  if (typeof value !== 'string') return ''
  return value
    .replace(/<[^>]*>/g, '')
    .replace(/[<>"'`]/g, '')
    .trim()
    .slice(0, maxLength)
}
