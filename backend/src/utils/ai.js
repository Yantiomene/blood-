const axios = require('axios');
const https = require('https');
const dns = require('dns');
// Prefer IPv4 for external API calls to avoid IPv6 ENETUNREACH on some networks
try { dns.setDefaultResultOrder && dns.setDefaultResultOrder('ipv4first'); } catch (_) {}



// Gemini (Google Generative Language API) configuration
const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
const GEMINI_MODEL = process.env.GEMINI_MODEL || 'gemini-2.5-flash';

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



async function callGemini(title) {
  if (!GEMINI_API_KEY) return { content: localFallbackHTML(title), provider: 'local_fallback' };
  const { system, user } = buildPrompt(title);
  try {
    const endpoint = `https://generativelanguage.googleapis.com/v1beta/models/${GEMINI_MODEL}:generateContent`;
    const response = await axios.post(
      endpoint,
      {
        // Minimal payload aligned with working curl example
        contents: [{ parts: [{ text: user }] }],
      },
      {
        timeout: 50000,
        // Force IPv4 lookup to avoid ENETUNREACH on IPv6-only resolution
        lookup: (hostname, options, cb) => dns.lookup(hostname, { family: 4 }, cb),
        headers: {
          'x-goog-api-key': GEMINI_API_KEY,
          'Content-Type': 'application/json',
        },
      }
    );

    const parts = response?.data?.candidates?.[0]?.content?.parts || [];
    const content = parts.map(p => p.text || '').join('').trim();
    if (!content) {
      console.warn('[Gemini] Empty content; falling back to local');
      return { content: localFallbackHTML(title), provider: 'local_fallback' };
    }
    return { content, provider: 'gemini' };
  } catch (error) {
    const isTimeout = error?.code === 'ECONNABORTED' || /timeout/i.test(error?.message || '');
    if (isTimeout) {
      console.error('[Gemini] generation failed: request timed out');
    } else {
      console.error('[Gemini] generation failed:', error?.response?.data || error.message);
    }
    return { content: localFallbackHTML(title), provider: 'local_fallback' };
  }
}

async function generateBlogHTMLFromTitle(title) {
  // In tests, always use local fallback for speed and determinism
  if (process.env.NODE_ENV === 'test') {
    return { content: localFallbackHTML(title), provider: 'local_fallback' };
  }
  // Prefer Gemini when configured, else local fallback
  return await callGemini(title);
}

module.exports = {
  generateBlogHTMLFromTitle,
};