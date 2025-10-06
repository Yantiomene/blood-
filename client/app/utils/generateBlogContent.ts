export const generateContentFromTitle = (title: string): string => {
  const t = title.trim();
  const tl = t.toLowerCase();

  const hash = (s: string) => {
    let h = 5381;
    for (let i = 0; i < s.length; i++) h = ((h << 5) + h) + s.charCodeAt(i);
    return Math.abs(h);
  };
  const seed = hash(tl);
  const pick = <T,>(arr: T[], offset: number = 0) => arr[(seed + offset) % arr.length];

  const theme = (() => {
    if (/(donat|drive|give)/.test(tl)) return 'donation';
    if (/(plasma|platelet)/.test(tl)) return 'plasma';
    if (/(type|abo|o\b|a\b|b\b|ab\b)/.test(tl)) return 'bloodType';
    if (/(campaign|event|community)/.test(tl)) return 'campaign';
    if (/(health|wellness|care)/.test(tl)) return 'health';
    return 'general';
  })();

  const facts: Record<string, string[]> = {
    donation: [
      'Every 2 seconds, someone needs blood.',
      'One donation can save up to three lives.',
      'Less than 10% of eligible donors give annually.',
      'Type O negative is the universal donor for red cells.'
    ],
    plasma: [
      'Plasma carries proteins that help blood clot.',
      'Plasma donations support burn victims and trauma care.',
      'AB plasma is universal and always in demand.'
    ],
    bloodType: [
      'Knowing your type helps hospitals plan inventory.',
      'O negative is crucial for emergencies and newborns.',
      'Matching type improves transfusion safety and outcomes.'
    ],
    campaign: [
      'Local drives boost supply during seasonal shortages.',
      'Community partnerships multiply impact and awareness.',
      'Consistent scheduling builds donor habits.'
    ],
    health: [
      'Healthy donors hydrate and rest before giving.',
      'Iron-rich foods support recovery post donation.',
      'Most donations take less than an hour, including screening.'
    ],
    general: [
      'Blood cannot be manufactured — only donated.',
      'Hospitals use blood daily for surgeries and emergencies.',
      'Your donation may help cancer patients, accident victims, and more.'
    ],
  };

  const tips: Record<string, string[]> = {
    donation: [
      'Check eligibility and bring a valid ID.',
      'Eat a balanced meal and hydrate well.',
      'Plan a calm, low-exertion day post donation.'
    ],
    plasma: [
      'Boost protein intake the day before donation.',
      'Wear comfy clothing; sessions can take longer.',
      'Ask about frequency — plasma donors can donate more often.'
    ],
    bloodType: [
      'Add your blood type to your health records.',
      'Share type-specific donation needs with friends.',
      'Consider double red donation if eligible.'
    ],
    campaign: [
      'Share event details on social media.',
      'Invite colleagues and family to join.',
      'Sign up for a time slot to avoid waits.'
    ],
    health: [
      'Sleep 7–8 hours before your appointment.',
      'Snack with iron and vitamin C for better absorption.',
      'Avoid heavy lifting after donating.'
    ],
    general: [
      'Bring a friend and make it a habit.',
      'Set a reminder for your next eligible date.',
      'Thank staff and volunteers — they power the process.'
    ],
  };

  const quotes: Record<string, string[]> = {
    donation: [
      '“Your pint today is a patient’s tomorrow.”',
      '“Small acts create big outcomes in care.”'
    ],
    plasma: [
      '“Plasma turns moments of crisis into chances of recovery.”',
      '“Invisible proteins, visible impact.”'
    ],
    bloodType: [
      '“Every type matters. Every match counts.”',
      '“Compatibility is care.”'
    ],
    campaign: [
      '“Together, we raise supply and hope.”',
      '“Community is the heartbeat of donation.”'
    ],
    health: [
      '“Care for yourself; you’re caring for others.”',
      '“Wellness fuels generosity.”'
    ],
    general: [
      '“Blood is a bridge from donor to patient.”',
      '“Hope flows through every donation.”'
    ],
  };

  const fact = pick(facts[theme]);
  const tip1 = pick(tips[theme], 1);
  const tip2 = pick(tips[theme], 2);
  const tip3 = pick(tips[theme], 3);
  const quote = pick(quotes[theme]);

  return `
<section class="not-prose bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
  <h2 class="m-0 text-red-800">${t}</h2>
  <p class="m-0 text-sm text-red-700">${fact}</p>
</section>

<h3>Overview</h3>
<p>${t} impacts patients, donors, and care teams across our communities. This guide breaks down what it means, why it matters, and how you can help — with practical takeaways tailored to “${t}”.</p>

<h3>Why it matters</h3>
<p>Understanding ${tl} improves preparedness and care quality. It informs inventory planning, donor outreach, and real-time decisions when minutes count.</p>

<h3>Quick tips</h3>
<ul>
  <li>${tip1}</li>
  <li>${tip2}</li>
  <li>${tip3}</li>
  </ul>

<blockquote>${quote}</blockquote>

<h3>Take action</h3>
<p>Share this post, register for a local drive, or talk with friends and family about ${tl}. Small steps multiply — your voice can bring new donors and better outcomes.</p>

<hr />
<p class="text-sm text-gray-500">Updated guidance for: ${t}. Generated automatically based on the title.</p>
`;
};

export const stripHtml = (s: string): string => s.replace(/<[^>]*>/g, '');

// Format raw AI text into semantic, styled HTML suited for blog rendering
export const formatAIContentToHtml = (raw: string): string => {
  const text = (raw || '').trim();
  if (!text) return '';

  const lines = text.split(/\r?\n+/).map(l => l.trim());
  const blocks: string[] = [];

  // helpers
  const isHeading = (l: string) => {
    if (!l) return false;
    if (l.length > 120) return false;
    if (/^©\s?\d{4}/.test(l)) return false;
    // treat lines without sentence-ending punctuation as headings
    return !/[.!?]$/.test(l) || /:\s*$/.test(l);
  };
  const isQuote = (l: string) => /^".*"$/.test(l) || /^—\s/.test(l);
  const isByline = (l: string) => /^By\s/.test(l) || /\|\s*\w+\s+\d{1,2},\s*\d{4}$/.test(l);

  let i = 0;
  // Title and subtitle
  if (lines[i]) {
    blocks.push(`<h1>${lines[i]}</h1>`);
    i++;
  }
  if (lines[i] && isHeading(lines[i])) {
    blocks.push(`<h2 class="lead">${lines[i]}</h2>`);
    i++;
  }
  if (lines[i] && isByline(lines[i])) {
    blocks.push(`<div class="byline">${lines[i]}</div>`);
    i++;
  }

  // group remaining into sections
  while (i < lines.length) {
    const line = lines[i];
    if (!line) { i++; continue; }

    // heading start of a section
    if (isHeading(line)) {
      const level = blocks.some(b => b.startsWith('<h2')) ? 'h3' : 'h2';
      blocks.push(`<${level}>${line.replace(/:\s*$/, '')}</${level}>`);
      i++;
      // collect subsequent list or paragraph lines
      const listItems: string[] = [];
      while (i < lines.length && lines[i] && !isHeading(lines[i])) {
        const cur = lines[i];
        // treat "Label: value" as a list item
        if (/^[A-Z][A-Za-z\s]+:\s+/.test(cur)) {
          const [label, rest] = cur.split(/:\s+/, 2);
          listItems.push(`<li><span class="li-label">${label}:</span> ${rest}</li>`);
          i++;
          continue;
        }
        if (isQuote(cur)) {
          blocks.push(`<blockquote>${cur.replace(/^—\s*/, '— ')}</blockquote>`);
          i++;
          continue;
        }
        // regular paragraph
        blocks.push(`<p>${cur}</p>`);
        i++;
      }
      if (listItems.length) {
        blocks.push(`<ul class="list-disc pl-6 space-y-1">${listItems.join('')}</ul>`);
      }
      continue;
    }

    // standalone quote or paragraph
    if (isQuote(line)) {
      blocks.push(`<blockquote>${line.replace(/^—\s*/, '— ')}</blockquote>`);
      i++;
      continue;
    }
    blocks.push(`<p>${line}</p>`);
    i++;
  }

  // footer copyright if present
  const last = lines[lines.length - 1];
  if (last && /^©\s?\d{4}/.test(last)) {
    blocks.push(`<hr /><p class="copyright">${last}</p>`);
  }

  return blocks.join('\n');
};