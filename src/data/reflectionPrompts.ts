export interface ReflectionPromptItem {
  id: string;
  category: 'peace' | 'release' | 'gratitude' | 'motherhood' | 'faith' | 'temple';
  categoryLabel: string;
  categoryEmoji: string;
  prompt: string;
  scriptureAnchor: string;
  suggestedMode: 'gratitude' | 'challenge' | 'both';
  placeholderHint: string;
}

export const REFLECTION_PROMPT_LIBRARY: ReflectionPromptItem[] = [
  {
    id: 'prompt-peace-1',
    category: 'peace',
    categoryLabel: "God's Peace & Stillness",
    categoryEmoji: '🕊️',
    prompt: 'A time I felt God’s peace today',
    scriptureAnchor: 'Philippians 4:7 — "And the peace of God, which transcends all understanding, will guard your hearts and your minds in Christ Jesus."',
    suggestedMode: 'gratitude',
    placeholderHint: 'Describe the exact moment stillness broke through the noise (e.g. during a quiet breath before dinner, watching rain, a whispered prayer)...'
  },
  {
    id: 'prompt-release-1',
    category: 'release',
    categoryLabel: 'Surrender & Release',
    categoryEmoji: '🌿',
    prompt: 'One thing I am releasing today',
    scriptureAnchor: '1 Peter 5:7 — "Cast all your anxiety on him because he cares for you."',
    suggestedMode: 'challenge',
    placeholderHint: 'Name the specific control, expectation, regret, or worry you surrender into the Father’s hands tonight...'
  },
  {
    id: 'prompt-gratitude-1',
    category: 'gratitude',
    categoryLabel: 'Gratitude & Wonder',
    categoryEmoji: '🙏',
    prompt: 'An unexpected glimpse of God’s goodness in my everyday routine',
    scriptureAnchor: 'James 1:17 — "Every good and perfect gift is from above, coming down from the Father of the heavenly lights."',
    suggestedMode: 'gratitude',
    placeholderHint: 'What small, ordinary grace brought warmth to your heart today?'
  },
  {
    id: 'prompt-motherhood-1',
    category: 'motherhood',
    categoryLabel: 'Motherhood & Family Grace',
    categoryEmoji: '🤍',
    prompt: 'A moment I chose patience and gentleness over hurry with my loved ones',
    scriptureAnchor: 'Colossians 3:12 — "Clothe yourselves with compassion, kindness, humility, gentleness and patience."',
    suggestedMode: 'both',
    placeholderHint: 'Where did you feel the friction, and how did Holy Spirit help you pause and soften?'
  },
  {
    id: 'prompt-faith-1',
    category: 'faith',
    categoryLabel: 'Faith & Scripture Anchor',
    categoryEmoji: '✨',
    prompt: 'A promise from God’s Word that anchored my thoughts today',
    scriptureAnchor: 'Hebrews 10:23 — "Let us hold unswervingly to the hope we profess, for he who promised is faithful."',
    suggestedMode: 'gratitude',
    placeholderHint: 'Which verse or biblical truth did you recite when doubt or weariness knocked?'
  },
  {
    id: 'prompt-temple-1',
    category: 'temple',
    categoryLabel: 'Temple Care & Restorative Vitality',
    categoryEmoji: '🌸',
    prompt: 'How did I honor my body as the temple of the Holy Spirit today?',
    scriptureAnchor: '1 Corinthians 6:19-20 — "Do you not know that your bodies are temples of the Holy Spirit, who is in you... therefore honor God with your bodies."',
    suggestedMode: 'both',
    placeholderHint: 'Whether nourishing hydration, unhurried rest, a restorative walk, or turning off screens early...'
  },
  {
    id: 'prompt-peace-2',
    category: 'peace',
    categoryLabel: "God's Peace & Stillness",
    categoryEmoji: '🕊️',
    prompt: 'Where in my home or work did I invite Jesus to quiet the storm?',
    scriptureAnchor: 'Mark 4:39 — "He got up, rebuked the wind and said to the waves, ‘Quiet! Be still!’ Then the wind died down and it was completely calm."',
    suggestedMode: 'challenge',
    placeholderHint: 'What felt turbulent, and what does trusting His sovereign authority look like right now?'
  },
  {
    id: 'prompt-release-2',
    category: 'release',
    categoryLabel: 'Surrender & Release',
    categoryEmoji: '🌿',
    prompt: 'A lie or harsh self-criticism I am replacing with God’s truth',
    scriptureAnchor: '2 Corinthians 10:5 — "We take captive every thought to make it obedient to Christ."',
    suggestedMode: 'both',
    placeholderHint: 'What self-imposed standard made you feel not enough, and what does the Father say about you?'
  },
  {
    id: 'prompt-gratitude-2',
    category: 'gratitude',
    categoryLabel: 'Gratitude & Wonder',
    categoryEmoji: '🙏',
    prompt: 'A sister or friend whose encouragement refreshed my spirit',
    scriptureAnchor: 'Proverbs 27:17 — "As iron sharpens iron, so one person sharpens another."',
    suggestedMode: 'gratitude',
    placeholderHint: 'Who reached out, smiled, prayed, or shared a word in season with you?'
  },
  {
    id: 'prompt-motherhood-2',
    category: 'motherhood',
    categoryLabel: 'Motherhood & Family Grace',
    categoryEmoji: '🤍',
    prompt: 'Entrusting my children’s future and character into God’s sovereign hands',
    scriptureAnchor: 'Isaiah 54:13 — "All your children will be taught by the Lord, and great will be their peace."',
    suggestedMode: 'challenge',
    placeholderHint: 'What maternal worry can you surrender to the One who loves them even more than you do?'
  },
  {
    id: 'prompt-faith-2',
    category: 'faith',
    categoryLabel: 'Faith & Scripture Anchor',
    categoryEmoji: '✨',
    prompt: 'Where did I step forward in quiet obedience even when feeling uncertain?',
    scriptureAnchor: '2 Corinthians 5:7 — "For we walk by faith, not by sight."',
    suggestedMode: 'both',
    placeholderHint: 'A conversation, boundary, creative step, or generous act you took in faith...'
  },
  {
    id: 'prompt-temple-2',
    category: 'temple',
    categoryLabel: 'Temple Care & Restorative Vitality',
    categoryEmoji: '🌸',
    prompt: 'Recognizing holy limits: Choosing rest over striving and exhaustion',
    scriptureAnchor: 'Psalm 127:2 — "In vain you rise early and stay up late, toiling for food to eat—for he grants sleep to those he loves."',
    suggestedMode: 'challenge',
    placeholderHint: 'Where did you feel tempted to run on empty? How will you protect sacred Sabbath tonight?'
  }
];

export function getPromptOfTheDay(): ReflectionPromptItem {
  // Rotate deterministically by day of year so every day has a featured prompt
  const now = new Date();
  const startOfYear = new Date(now.getFullYear(), 0, 0);
  const diff = (now.getTime() - startOfYear.getTime()) + ((startOfYear.getTimezoneOffset() - now.getTimezoneOffset()) * 60 * 1000);
  const oneDay = 1000 * 60 * 60 * 24;
  const dayOfYear = Math.floor(diff / oneDay);
  return REFLECTION_PROMPT_LIBRARY[dayOfYear % REFLECTION_PROMPT_LIBRARY.length];
}
