const axios = require('axios');

const DEEPSEEK_API_KEY = process.env.DEEPSEEK_API_KEY;
const DEEPSEEK_MODEL = process.env.DEEPSEEK_MODEL || 'deepseek-chat';
// Prefer configured URL; otherwise try .com, then .cn domains in order
const CANDIDATE_URLS = (
  process.env.DEEPSEEK_API_URL
    ? [process.env.DEEPSEEK_API_URL]
    : [
        'https://api.deepseek.com/v1/chat/completions',
        'https://api.deepseek.cn/v1/chat/completions',
      ]
);

function buildPrompt(title) {
  const system = 'You are an assistant that writes semantic, accessible HTML blog posts. Use clear headings, lists, quotes, and concise paragraphs. Avoid external scripts. Keep the tone informative and friendly.';
  const user = `Write a well-structured HTML blog post based on this title. Include: hero header, intro, 3-5 sections with h2/h3, bullet points, a short quote block, and a concise conclusion. Keep it under 1200 words.

Title: ${title}
Constraints:
- Output only HTML (no markdown).
- Use semantic tags (h1-h3, p, ul/ol, blockquote).
- Avoid inline styles except minimal emphasis.`;
  return { system, user };
}

function localFallbackHTML(title) {
  return `
  <section class="hero bg-red-50 p-4 rounded">
    <h1>${title}</h1>
    <p>Explore key insights, practical guidance, and highlights.</p>
  </section>
  <h2>Overview</h2>
  <p>This article offers a concise overview and actionable takeaways.</p>
  <h2>Key Points</h2>
  <ul>
    <li>Context and relevance</li>
    <li>Practical guidance</li>
    <li>Common pitfalls</li>
    <li>Recommendations</li>
  </ul>
  <h2>Deep Dive</h2>
  <p>Short paragraphs that expand on the topic.</p>
  <blockquote>“A brief, memorable insight related to the topic.”</blockquote>
  <h2>Conclusion</h2>
  <p>Summary and suggested next steps.</p>
  `;
}

async function callDeepSeek(title) {
  if (!DEEPSEEK_API_KEY) return { content: localFallbackHTML(title), provider: 'local_fallback' };
  const { system, user } = buildPrompt(title);
  const payload = {
    model: DEEPSEEK_MODEL,
    messages: [
      { role: 'system', content: system },
      { role: 'user', content: user },
    ],
    temperature: 0.7,
  };
  const headers = {
    Authorization: `Bearer ${DEEPSEEK_API_KEY}`,
    'Content-Type': 'application/json',
  };

  for (const url of CANDIDATE_URLS) {
    try {
      const response = await axios.post(url, payload, { headers, timeout: 15000 });
      const content = response?.data?.choices?.[0]?.message?.content || '';
      if (!content.trim()) {
        console.warn(`[DeepSeek] Empty content from ${url}. Will try next or fallback.`);
        continue; // try next candidate
      }
      const provider = url.includes('deepseek') ? 'deepseek' : 'ai_provider';
      return { content, provider };
    } catch (error) {
      const msg = error?.response?.data || error.message;
      console.error(`[DeepSeek] generation failed via ${url}:`, msg);
      // If hostname not found or network error, try next candidate
      const errCode = error?.code || '';
      const isNetwork = ['ENOTFOUND', 'ECONNRESET', 'ETIMEDOUT'].includes(errCode);
      if (isNetwork) continue; // try next
      // For 4xx/5xx responses, do not retry other domains; fallback
      break;
    }
  }
  return { content: localFallbackHTML(title), provider: 'local_fallback' };
}

module.exports = {
  generateBlogHTMLFromTitle: callDeepSeek,
};