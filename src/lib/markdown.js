/**
 * Minimal markdown renderer for lesson theory text.
 * Supports: headings, bold, italic, code blocks, inline code, lists, paragraphs.
 */
export function renderMarkdown(md) {
  let html = md
    // Escape HTML
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')

  // Code blocks (``` ... ```)
  html = html.replace(/```(\w*)\n([\s\S]*?)```/g, (_, lang, code) => {
    const escaped = code.trim()
    return `<pre class="bg-[#0a0a0f] border border-[#2a2a3e] rounded-lg p-4 my-3 overflow-x-auto"><code class="text-sm font-mono text-[#c8c8d4]">${escaped}</code></pre>`
  })

  // Inline code
  html = html.replace(/`([^`]+)`/g, '<code class="bg-[#1c1c2e] text-[#6c63ff] px-1.5 py-0.5 rounded text-sm font-mono">$1</code>')

  // Bold (**text**)
  html = html.replace(/\*\*([^*]+)\*\*/g, '<strong class="font-semibold text-white">$1</strong>')

  // Italic (*text*)
  html = html.replace(/\*([^*]+)\*/g, '<em class="italic text-[#a8a8b8]">$1</em>')

  // Headings (## then ###)
  html = html.replace(/^### (.+)$/gm, '<h3 class="text-lg font-semibold text-white mt-6 mb-2">$1</h3>')
  html = html.replace(/^## (.+)$/gm, '<h2 class="text-xl font-semibold text-white mt-6 mb-3">$1</h2>')

  // Unordered lists
  html = html.replace(/^- (.+)$/gm, '<li class="ml-5 text-[#c8c8d4] leading-relaxed">$1</li>')
  html = html.replace(/(<li.*<\/li>\n?)+/g, (match) => `<ul class="space-y-1 my-3">${match}</ul>`)

  // Paragraphs (double newlines)
  html = html.replace(/\n\n/g, '</p><p class="text-[#c8c8d4] leading-relaxed mb-3">')

  // Wrap in paragraph if not already
  if (!html.startsWith('<')) {
    html = `<p class="text-[#c8c8d4] leading-relaxed mb-3">${html}</p>`
  }

  return html
}
