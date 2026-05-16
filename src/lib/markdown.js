/**
 * Minimal markdown renderer for lesson theory text.
 * Uses CSS custom properties for theming.
 */
export function renderMarkdown(md) {
  let html = md
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')

  // Code blocks
  html = html.replace(/```(\w*)\n([\s\S]*?)```/g, (_, lang, code) => {
    const escaped = code.trim()
    return `<pre style="background: var(--bg); border: 1px solid var(--border); border-radius: 0.5rem; padding: 1rem; margin: 0.75rem 0; overflow-x: auto;"><code style="font-size: 0.875rem; font-family: var(--font-mono), monospace; color: var(--text-dim);">${escaped}</code></pre>`
  })

  // Inline code
  html = html.replace(/`([^`]+)`/g, (_, code) =>
    `<code style="background: var(--surface-2); color: var(--accent); padding: 0.125rem 0.375rem; border-radius: 0.25rem; font-size: 0.875rem; font-family: var(--font-mono), monospace;">${code}</code>`
  )

  // Bold
  html = html.replace(/\*\*([^*]+)\*\*/g, '<strong style="font-weight: 600; color: var(--text);">$1</strong>')

  // Italic
  html = html.replace(/\*([^*]+)\*/g, '<em style="font-style: italic; color: var(--text-dim);">$1</em>')

  // Headings
  html = html.replace(/^### (.+)$/gm, '<h3 style="font-size: 1.125rem; font-weight: 600; color: var(--text); margin-top: 1.5rem; margin-bottom: 0.5rem;">$1</h3>')
  html = html.replace(/^## (.+)$/gm, '<h2 style="font-size: 1.25rem; font-weight: 600; color: var(--text); margin-top: 1.5rem; margin-bottom: 0.75rem;">$1</h2>')

  // Unordered lists
  html = html.replace(/^- (.+)$/gm, '<li style="margin-left: 1.25rem; line-height: 1.625;">$1</li>')
  html = html.replace(/(<li.*<\/li>\n?)+/g, (match) => `<ul style="display: flex; flex-direction: column; gap: 0.25rem; margin: 0.75rem 0;">${match}</ul>`)

  // Paragraphs
  html = html.replace(/\n\n/g, '</p><p style="line-height: 1.625; margin-bottom: 0.75rem;">')

  // Wrap in paragraph if not already
  if (!html.startsWith('<')) {
    html = `<p style="line-height: 1.625; margin-bottom: 0.75rem;">${html}</p>`
  }

  // Tables (simple pipe tables)
  html = html.replace(/\|(.+)\|/g, (match) => {
    if (match.includes('---')) return '' // skip separator rows
    const cells = match.split('|').filter(c => c.trim())
    return `<span style="font-family: var(--font-mono); font-size: 0.85rem;">| ${cells.join(' | ')} |</span><br>`
  })

  return html
}
