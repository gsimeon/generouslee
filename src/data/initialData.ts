import {
  User,
  ContentItem,
  Category,
  Tag,
  Question,
  CommunityGroup,
  CommunityPost,
  Mentor,
  Course,
  EventItem,
  ResourceItem,
  AuditLog,
  AnalyticsMetric
} from '../types';

export const INITIAL_CATEGORIES: Category[] = [
  {
    id: 'cat-faith-purpose',
    name: 'Faith & Divine Purpose',
    slug: 'faith-purpose',
    description: 'Walking boldly in your God-given calling, spiritual grounding, daily prayer, discerning divine timing, and living with conviction.',
    iconName: 'Sparkles',
    articleCount: 18
  },
  {
    id: 'cat-healthy-living',
    name: 'Healthy Living & Temple Care',
    slug: 'healthy-living',
    description: 'Honoring your body as a temple, physical vitality, nutrition, energy, self-motivation, and breaking chronic burnout.',
    iconName: 'HeartHandshake',
    articleCount: 15
  },
  {
    id: 'cat-motherhood',
    name: 'Motherhood & Family Legacy',
    slug: 'motherhood',
    description: 'Raising children with faith and love, breaking generational cycles, presence over perfection, and holding fast to family values.',
    iconName: 'Users',
    articleCount: 14
  },
  {
    id: 'cat-sisterhood',
    name: 'Sisterhood & Community',
    slug: 'sisterhood',
    description: 'Connecting with like-minded women of God, mutual accountability, uplifting prayer circles, and serving purpose together.',
    iconName: 'Award',
    articleCount: 12
  },
  {
    id: 'cat-marriage',
    name: 'Marriage & Relationships',
    slug: 'marriage',
    description: 'Spiritual partnership, mutual respect, communication without resentment, protecting peace, and honoring family covenants.',
    iconName: 'Heart',
    articleCount: 10
  },
  {
    id: 'cat-mindset',
    name: 'Mindset & Daily Motivation',
    slug: 'mindset',
    description: 'Building discipline over excuses, morning devotions, mental resilience, high standards, and stepping forward with courage.',
    iconName: 'Compass',
    articleCount: 11
  }
];

export const INITIAL_TAGS: Tag[] = [
  { id: 't-purpose', name: 'Walking in Purpose', slug: 'walking-in-purpose' },
  { id: 't-health', name: 'Temple Care & Health', slug: 'temple-care-health' },
  { id: 't-motivation', name: 'Daily Motivation', slug: 'daily-motivation' },
  { id: 't-faith', name: 'Faith & Prayer', slug: 'faith-and-prayer' },
  { id: 't-sisterhood', name: 'Like-Minded Sisterhood', slug: 'like-minded-sisterhood' },
  { id: 't-boundaries', name: 'Healthy Boundaries', slug: 'healthy-boundaries' },
  { id: 't-family', name: 'Family Values', slug: 'family-values' },
  { id: 't-burnout', name: 'Burnout Recovery', slug: 'burnout-recovery' }
];

export const INITIAL_USERS: User[] = [
  {
    id: 'usr-admin-1',
    email: 'creator@generouslee.life',
    name: 'Latisha Langley',
    role: 'super_admin',
    avatarUrl: '/latisha.jpg',
    bio: 'Founder of Generouslee (@latishalangley). Healthy self motivated woman of God seeking like-minded people serving purpose.',
    interests: ['Faith & Purpose', 'Healthy Living', 'Motherhood & Family', 'Sisterhood', 'Personal Growth'],
    isEmailVerified: true,
    createdAt: '2025-01-10T09:00:00Z',
    updatedAt: '2026-09-01T12:00:00Z'
  },
  {
    id: 'usr-editor-1',
    email: 'sarah.editor@generouslee.life',
    name: 'Sarah Adeyemi',
    role: 'editor',
    avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=400',
    bio: 'Senior Content Editor & Family Wellbeing Researcher.',
    interests: ['Parenting', 'Mental Wellness', 'Relationships'],
    isEmailVerified: true,
    createdAt: '2025-02-15T11:00:00Z',
    updatedAt: '2026-08-20T10:00:00Z'
  },
  {
    id: 'usr-member-1',
    email: 'amara.k@example.com',
    name: 'Amara K.',
    role: 'user',
    avatarUrl: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=400',
    bio: 'First-time mother to 14-month-old twin boys, navigating marriage in the early postpartum years.',
    interests: ['Motherhood', 'Marriage', 'Mental Wellness', 'Parenting'],
    isEmailVerified: true,
    createdAt: '2026-05-12T14:30:00Z',
    updatedAt: '2026-09-10T16:00:00Z'
  }
];

export const INITIAL_CONTENT: ContentItem[] = [
  {
    id: 'cnt-faith-1',
    title: 'The Healthy, Self-Motivated Woman of God: Walking in Divine Purpose Every Day',
    slug: 'healthy-self-motivated-woman-of-god',
    excerpt: 'How to cultivate physical health, mental fortitude, spiritual grounding, and genuine sisterhood as a woman dedicated to serving God’s calling.',
    body: `
# Healthy, Self-Motivated, and Serving Purpose

When you walk through life as a woman of God, you quickly realize that motivation is not about fleeting emotions or hype. True motivation is rooted in **purpose**—the quiet, unshakable conviction that God has placed you here with intention, with work to do, and with people to love and serve.

On TikTok (@latishalangley), I share every day with our sisterhood:
> *"Healthy self motivated women of God seeking like-minded people serving purpose."*

This is not just a bio. It is a daily standard, a spiritual posture, and a way of life.

### 1. Your Body is a Temple: Caring for Your Health as an Act of Worship
You cannot pour out into your family, your children, your community, or your calling if your temple is running on empty.
- **Honor your hydration, rest, and nourishing food.** When you take care of your body, you are honoring the vessel God gave you.
- **Movement is celebration, not punishment.** Move your body daily with gratitude for what it can accomplish.
- **Guard your energy.** Discern what is draining you spiritually and emotionally, and give yourself permission to step back into stillness with God.

### 2. Purpose Over Comparison
In a digital world that shouts for attention, it is easy to look at another woman's season and question your own. But God did not call you to walk someone else's path; He called you to walk yours with excellence, integrity, and faith.
- Where has God planted your feet right now?
- Who has He placed in your immediate reach to encourage, mentor, or lift up?
- When you serve faithfully in the small assignments, God opens doors to greater territory.

### 3. Gathering with Like-Minded Sisters
Solitude during warfare is dangerous. Every self-motivated woman of God needs sisters who pray with her, hold her accountable, speak life into her vision, and refuse to let her shrink back.

Let this platform be your sanctuary where faith, family, wellness, and purpose unite.
    `,
    coverImage: '/latisha.jpg',
    author: {
      name: 'Latisha Langley',
      avatarUrl: '/latisha.jpg',
      role: 'Founder & Purpose Mentor (@latishalangley)'
    },
    contentType: 'article',
    category: 'faith-purpose',
    tags: ['Walking in Purpose', 'Temple Care & Health', 'Daily Motivation', 'Faith & Prayer'],
    seoTitle: 'The Healthy, Self-Motivated Woman of God | Generouslee',
    seoDescription: 'Latisha Langley shares the blueprint for walking in divine purpose, honoring your temple, and building a sisterhood of faith.',
    status: 'published',
    publishedDate: '2026-09-14T08:00:00Z',
    updatedDate: '2026-09-14T08:00:00Z',
    featured: true,
    readingTimeMinutes: 5,
    viewCount: 28400,
    shareCount: 6510,
    saveCount: 8920
  },
  {
    id: 'cnt-1',
    title: 'The Silent Grief of Matrescence: Mourning Your Old Self While Deeply Loving Your Baby',
    slug: 'silent-grief-of-matrescence',
    excerpt: 'Why feeling disoriented after becoming a mother does not mean you are ungrateful—it means your entire psychological identity is undergoing rebirth.',
    body: `
# The Quiet Earthquake of Becoming a Mother

When a child is born, two beings enter the world: the baby, and the woman reborn as a mother. Yet our culture celebrates the arrival of the newborn while completely overlooking the psychological rebirth—and grief—experienced by the mother.

In anthropology and psychology, this transition is termed **matrescence**. Much like adolescence, it is accompanied by hormonal surges, neurological rewiring, physical transformations, and an existential questioning of who you are.

### The Guilt of Missing Your Freedom

Almost every mother I speak with in our community whispers the same confession with heavy eyes:

> *"Latisha, I adore my child more than life itself. But some afternoons, I sit in my car for five extra minutes just to remember what it felt like when my time belonged solely to me. Does that make me an awful mother?"*

The answer is an unequivocal, resounding **no**.

Missing your autonomy, your quiet mornings, your unhurried thoughts, or your pre-baby career momentum does not detract from your love for your child. It simply honors the woman who lived before the baby arrived.

### Three Gentle Practices for This Season

1. **Acknowledge the parallel emotions:** You can hold intense, heart-bursting gratitude for your child in your right hand, and quiet sorrow for your former freedom in your left hand. Both can sit at your table without competing.
2. **Name the invisible shift:** Speak to your partner or a trusted confidante without sugar-coating: *"I am learning who I am right now, and some days feel heavy."*
3. **Anchor one non-negotiable micro-solitude:** It does not need to be a weekend spa retreat. Ten minutes of warm tea with noise-canceling headphones before anyone awakens can reconnect you to your core.

You are not failing. You are transforming.
    `,
    coverImage: 'https://images.unsplash.com/photo-1516627145497-ae6968895b74?auto=format&fit=crop&q=80&w=1200',
    author: {
      name: 'Latisha Langley',
      avatarUrl: '/latisha.jpg',
      role: 'Founder & Purpose Mentor (@latishalangley)'
    },
    contentType: 'article',
    category: 'motherhood',
    tags: ['Burnout Recovery', 'Family Values', 'Walking in Purpose'],
    seoTitle: 'The Silent Grief of Matrescence | Generouslee',
    seoDescription: 'Explore the psychological rebirth of motherhood, why grieving your former self is natural, and how to practice gentle self-compassion.',
    status: 'published',
    publishedDate: '2026-09-02T08:00:00Z',
    updatedDate: '2026-09-02T08:00:00Z',
    featured: true,
    readingTimeMinutes: 5,
    viewCount: 14820,
    shareCount: 2310,
    saveCount: 3840
  },
  {
    id: 'cnt-2',
    title: 'De-escalating the Roommate Phase: Restoring Warmth and Intimacy in Your Marriage',
    slug: 'de-escalating-roommate-phase-marriage',
    excerpt: 'When logistics, diaper rosters, and exhaustion replace date nights, how do you rediscover each other as lovers and allies instead of mere household co-managers?',
    body: `
# From Lovers to Shift Managers: How Did We Get Here?

It happens gradually, almost imperceptibly. One day you are two people engrossed in each other's dreams, sharing late-night laughter over dinner. A few years and toddlers later, your conversations resemble a daily stand-up meeting between two stressed corporate project managers:

- *"Did you pack the extra wipes?"*
- *"Who is doing pickup on Thursday?"*
- *"We need more oat milk."*

Resentment festers not because love vanished, but because emotional reserves are drained dry by the invisible mental load of running a home.

### The Myth of Equal 50/50 Division

One of the greatest traps in modern marriage is believing that every day must be a strict 50/50 balance. Some days you have 30% to give, and your partner has 70%. Some days you both have 20%—and that is when grace, humor, and takeout food must fill the remaining 60%.

### The 6-Second Kiss and The Daily 10-Minute Sanity Check

To break the roommate spell without requiring expensive vacations:

1. **The Gottman 6-Second Kiss:** A fleeting peck is a transaction. A 6-second kiss requires conscious presence and releases oxytocin, interrupting fight-or-flight stress responses.
2. **Close the Logistics Ledger at 8:30 PM:** Agree that after a certain hour, conversations about home repairs, pediatrician appointments, and budget spreadsheets are paused until tomorrow.
3. **Appreciation over Critique:** When you notice your spouse doing something helpful—whether carrying laundry up the stairs or refilling your water cup—voice it instantly.

You are on the same team. Remember that the current season of little hands and sleepless nights is temporary, but the foundation you preserve today will shelter your family tomorrow.
    `,
    coverImage: 'https://images.unsplash.com/photo-1529156069898-49953e39b3ac?auto=format&fit=crop&q=80&w=1200',
    author: {
      name: 'Latisha Langley',
      avatarUrl: '/latisha.jpg',
      role: 'Founder & Purpose Mentor (@latishalangley)'
    },
    contentType: 'article',
    category: 'marriage',
    tags: ['Healthy Boundaries', 'Family Values'],
    seoTitle: 'How to Fix the Roommate Phase in Marriage | Generouslee',
    seoDescription: 'Practical relationship strategies for exhausted parents to break roommate syndrome, rebuild intimacy, and communicate with gentleness.',
    status: 'published',
    publishedDate: '2026-08-25T10:00:00Z',
    updatedDate: '2026-08-25T10:00:00Z',
    featured: true,
    readingTimeMinutes: 6,
    viewCount: 22450,
    shareCount: 4120,
    saveCount: 5210
  },
  {
    id: 'cnt-3',
    title: 'Why You Lose Your Temper with Your Toddler (And How to Co-Regulate Your Own Nervous System)',
    slug: 'why-you-lose-temper-toddler-co-regulation',
    excerpt: 'Tantrums are not defiance; they are distress. But when your child screams, why does your body react as though you are facing a physical threat?',
    body: `
# It Is Not Just "Bad Behavior"—It Is A Mirror

Have you ever found yourself yelling at a two-year-old who simply spilled juice, and immediately felt a wave of shame wash over your chest?

You are not a broken parent. You are an overstimulated human operating in chronic sympathetic nervous system arousal.

When a toddler screams, their underdeveloped prefrontal cortex cannot process their big feelings. If your internal stress baseline is already at 90%, their scream tips you into fight-or-flight. You aren't reacting to the spilled juice; you are reacting to sensory overload and decades of your own unaddressed emotional conditioning.

### Co-Regulation Precedes Self-Regulation

A child cannot learn to calm down on their own until they have borrowed their parents' calm a thousand times over.

Here is the three-step rhythm to remember when the house is chaotic:

1. **Ground your feet before speaking:** Feel the soles of your shoes against the floor. Drop your shoulders away from your ears. Take one deep physiological sigh (two quick inhales through the nose, one long exhale through the mouth).
2. **Get low physically:** Towering over a child amplifies their perception of threat. Kneel or sit at eye level.
3. **Validate the boundary, not the tantrum:** *"You are allowed to feel furious that screen time is over. I will keep your body safe while you cry, but the tablet stays put."*

Parenting with gentle boundaries is not about permissiveness; it is about providing sturdy, unshakable walls inside which little humans feel safe enough to feel big things.
    `,
    coverImage: 'https://images.unsplash.com/photo-1543332164-6e82f355badc?auto=format&fit=crop&q=80&w=1200',
    author: {
      name: 'Sarah Adeyemi',
      avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=400',
      role: 'Family Wellbeing Researcher'
    },
    contentType: 'article',
    category: 'parenting',
    tags: ['Toddler Emotions', 'Resilience', 'Self-Compassion'],
    seoTitle: 'Conscious Parenting & Emotional Co-Regulation | Generouslee',
    seoDescription: 'Understand parental rage, sensory overstimulation, and learn nervous-system co-regulation techniques for peaceful parenting.',
    status: 'published',
    publishedDate: '2026-08-18T09:30:00Z',
    updatedDate: '2026-08-18T09:30:00Z',
    featured: true,
    readingTimeMinutes: 7,
    viewCount: 31080,
    shareCount: 6540,
    saveCount: 8900
  },
  {
    id: 'cnt-4',
    title: 'The "Good Girl" Conditioning That Makes Saying "No" Feel Like An Existential Threat',
    slug: 'good-girl-conditioning-saying-no-boundaries',
    excerpt: 'Many women were rewarded in childhood for being accommodating, agreeable, and hyper-vigilant to others’ comfort. Here is how to reclaim your boundary voice.',
    body: `
# The Cost of Being the Peacemaker

From an early age, little girls are praised for being "so helpful," "so sweet," and "so low maintenance." We absorb the message that our value lies in smoothing over friction and ensuring nobody else feels discomfort.

Fast forward to adulthood:
- You say yes to hosting the holiday gathering even when you are exhausted.
- You apologize when someone bumps into you at the grocery store.
- You feel sick to your stomach when setting a boundary with your in-laws.

### A Boundary Is A Distance At Which I Can Love Both You And Me

Renowned psychologist Dr. Prentis Hemphill gave us this definition, and it remains the golden standard for healthy relationships.

When you refuse to set a boundary out of fear of angering someone, you don't actually preserve peace—you trade external peace for internal warfare. That internal warfare eventually surfaces as fibromyalgia, chronic migraines, emotional numbness, or explosive resentment toward those you love most.

### Practice Script: The Compassionate Boundary

When someone asks for something you cannot give freely:

- *"I want to be transparent: I don't have the capacity to take this on right now, but I appreciate you thinking of me."*
- *"We are keeping our weekends sacred for immediate family downtime this month, so we won't be able to attend."*

No lengthy excuses. No over-explaining. A clear, gentle "No" is a complete sentence.
    `,
    coverImage: 'https://images.unsplash.com/photo-1506126613408-eca07ce68773?auto=format&fit=crop&q=80&w=1200',
    author: {
      name: 'Latisha Langley',
      avatarUrl: '/latisha.jpg',
      role: 'Founder & Purpose Mentor (@latishalangley)'
    },
    contentType: 'article',
    category: 'mindset',
    tags: ['Healthy Boundaries', 'Burnout Recovery', 'Daily Motivation'],
    seoTitle: 'Breaking People-Pleasing & Setting Boundaries | Generouslee',
    seoDescription: 'Discover how childhood conditioning fuels people-pleasing, and learn scripts to establish guilt-free boundaries with family and work.',
    status: 'published',
    publishedDate: '2026-08-10T14:00:00Z',
    updatedDate: '2026-08-10T14:00:00Z',
    featured: false,
    readingTimeMinutes: 5,
    viewCount: 18900,
    shareCount: 3420,
    saveCount: 4500
  },
  {
    id: 'cnt-5',
    title: 'The Temple Care & Emotional Decompression Guide (Free Checklist & Audio Practice)',
    slug: 'temple-care-emotional-decompression-guide',
    excerpt: 'A step-by-step printable workbook and somatic grounding protocol for when the day has been relentlessly overstimulating.',
    body: `
# Your Emergency Grounding Kit

For the evenings when the noise level has been relentless, the demands have been non-stop, and your nerve endings feel exposed to the elements.

### Step 1: Physical Disconnection
Wash your hands in lukewarm water. Notice the sensation of the water flowing between your fingers. This triggers sensory reset.

### Step 2: The 5-4-3-2-1 Sensory Orientation
- **5 things you see:** The wooden grain of the table, the shadow on the rug, the light on the wall.
- **4 things you touch:** Your soft sweater, the cool countertop, the cotton hem of your jeans.
- **3 things you hear:** The hum of the refrigerator, the wind outside the window.
- **2 things you smell:** Lavender oil, fresh air.
- **1 thing you taste:** A sip of cool water.

### Step 3: Scriptural Anchor & Breath
Inhale deeply: *"God has not given me a spirit of fear, but of power, love, and a sound mind."* (2 Timothy 1:7)
Exhale slowly: Release the tension in your jaw and shoulders.

Download the accompanying PDF checklist and keep it on your refrigerator.
    `,
    coverImage: 'https://images.unsplash.com/photo-1506784983877-45594efa4cbe?auto=format&fit=crop&q=80&w=1200',
    author: {
      name: 'Latisha Langley',
      avatarUrl: '/latisha.jpg',
      role: 'Founder & Purpose Mentor (@latishalangley)'
    },
    contentType: 'resource',
    category: 'healthy-living',
    tags: ['Temple Care & Health', 'Burnout Recovery'],
    seoTitle: 'Free Temple Care Emotional Decompression Guide | Generouslee',
    seoDescription: 'Download our free grounding workbook for overstimulated mothers navigating intense seasons.',
    status: 'published',
    publishedDate: '2026-09-01T12:00:00Z',
    updatedDate: '2026-09-01T12:00:00Z',
    featured: false,
    readingTimeMinutes: 4,
    viewCount: 16400,
    shareCount: 2900,
    saveCount: 6800,
    downloadUrl: '#'
  }
];

export const INITIAL_QUESTIONS: Question[] = [
  {
    id: 'q-101',
    userId: 'usr-member-1',
    authorName: 'Amara K.',
    isAnonymous: true,
    category: 'motherhood',
    questionText: 'How do I stop feeling crushing guilt every time I leave my 14-month-old twins with their grandmother for just two hours to get coffee or breathe?',
    contextNotes: 'I find myself checking the nanny cam every 5 minutes and feeling like a selfish mother.',
    publicConsent: true,
    status: 'published',
    submittedAt: '2026-09-05T10:15:00Z',
    moderatedAt: '2026-09-06T11:00:00Z',
    response: {
      id: 'resp-101',
      questionId: 'q-101',
      responderName: 'Latisha Langley',
      responderTitle: 'Founder & Purpose Mentor (@latishalangley)',
      responderAvatar: '/latisha.jpg',
      responseText: `Dear sweet mother, take a slow breath with me right now.

First, your guilt is not proof that you are doing something wrong; it is proof of your fierce attachment. But we must distinguish between *healthy protective vigilance* and *toxic maternal martyrdom*.

Your children do not need a mother who sacrifices every breath until she is hollowed out. They need a mother who demonstrates that adults have intrinsic human needs and self-worth. When you step out for two hours, you are not abandoning them—you are giving them the gift of a loving bond with their grandmother, and you are returning with a replenished nervous system.

Try this mental reframe: Leaving your babies for two hours is not time *away* from them; it is an investment *for* them. A mother operating at 10% capacity is short-tempered and anxious; a mother who rested for two hours can meet their bedtime tantrums with genuine patience.

Leave your phone in your handbag, order your favorite warm drink, and let your body remember what it feels like to just be *you*. You are doing beautifully.`,
      keyTakeaways: [
        'Maternal guilt is often conditioned martyrdom rather than genuine moral failure.',
        'Allowing loving relatives to care for toddlers strengthens village bonds and child resilience.',
        'A replenished mother models self-respect and returns with greater emotional stamina.'
      ],
      recommendedContentSlugs: ['silent-grief-of-matrescence', 'temple-care-emotional-decompression-guide'],
      answeredAt: '2026-09-07T14:00:00Z',
      helpfulCount: 428
    }
  },
  {
    id: 'q-102',
    userId: 'usr-member-2',
    authorName: 'Anonymous Mom',
    isAnonymous: true,
    category: 'marriage',
    questionText: 'My husband and I have completely stopped being playful. Every evening is spent staring at our phones in exhaustion. How do we start talking again without it turning into a fight about chores?',
    publicConsent: true,
    status: 'published',
    submittedAt: '2026-09-08T18:20:00Z',
    moderatedAt: '2026-09-09T09:30:00Z',
    response: {
      id: 'resp-102',
      questionId: 'q-102',
      responderName: 'Latisha Langley',
      responderTitle: 'Founder & Purpose Mentor (@latishalangley)',
      responderAvatar: '/latisha.jpg',
      responseText: `I hear the longing in your question so clearly. You miss your friend.

When survival mode takes over, playfulness is always the first casualty. Humor requires safety and excess energy, which neither of you have right now. The phone scrolling is simply "passive zoning out" because your brains cannot process more demands.

Instead of trying to force a 2-hour heavy relationship summit (which always invites chore defensiveness), try the "Micro-Connection Contract":

1. For the first 15 minutes after the kids sleep, put phones face down in a basket.
2. Ask one low-stakes question that has nothing to do with children or the dishwasher. For example: *"What was the weirdest or funniest thought you had today?"* or *"If we had an uninterrupted weekend right now, where would we go?"*
3. Physical contact without sexual expectation: Sit on the couch and rest your feet in his lap, or lean your head on his shoulder.

Rebuilding warmth is like blowing on embers—start with small, gentle puffs of oxygen.`,
      keyTakeaways: [
        'Exhaustion forces brains into numbing behavior (phone scrolling) rather than hostile neglect.',
        'Differentiate between chore coordination meetings and emotional connection moments.',
        'Micro-rituals of 10 to 15 minutes prevent marriage atrophy during high-demand parenting years.'
      ],
      recommendedContentSlugs: ['de-escalating-roommate-phase-marriage'],
      answeredAt: '2026-09-10T16:45:00Z',
      helpfulCount: 315
    }
  },
  {
    id: 'q-103',
    userId: 'usr-member-3',
    authorName: 'Blessing T.',
    isAnonymous: false,
    category: 'parenting',
    questionText: 'My 3-year-old throws himself on the grocery store floor when I say no to candy. Strangers stare and judge. What do I actually say in that exact moment?',
    publicConsent: true,
    status: 'published',
    submittedAt: '2026-09-10T11:00:00Z',
    moderatedAt: '2026-09-11T10:00:00Z',
    response: {
      id: 'resp-103',
      questionId: 'q-103',
      responderName: 'Sarah Adeyemi',
      responderTitle: 'Family Wellbeing Researcher',
      responderAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=400',
      responseText: `The grocery store meltdown is a rite of passage for every parent on Earth! Those staring strangers either forgot what toddlers are like or have never raised one.

In that moment, your only job is to be the anchor in his storm:
1. Don't lecture: A dysregulated brain cannot hear logic.
2. Keep your voice quiet and low: The louder the child, the softer your voice should become.
3. Say: *"I know you really wanted that treat. It is hard when the answer is no. I'm right here with you."*
4. Move him to a safe, quiet corner of the aisle if needed, take your own deep breath, and let the storm pass.

You are not performing for the aisle. You are parenting your child.`,
      keyTakeaways: [
        'Public meltdowns trigger parental embarrassment; detach from bystander judgment.',
        'Cognitive reasoning fails during limbic tantrums; use silence, softness, and physical safety.',
        'Consistency in boundaries teaches long-term emotional security.'
      ],
      recommendedContentSlugs: ['why-you-lose-temper-toddler-co-regulation'],
      answeredAt: '2026-09-12T13:00:00Z',
      helpfulCount: 289
    }
  },
  {
    id: 'q-104',
    userId: 'usr-member-1',
    authorName: 'Amara K.',
    isAnonymous: false,
    category: 'mental-wellness',
    questionText: 'How do I recognize when my postpartum exhaustion is crossing the line into depression or clinical anxiety?',
    contextNotes: 'I find myself worrying about catastrophic scenarios that feel irrational but impossible to stop.',
    publicConsent: false,
    status: 'under_review',
    submittedAt: '2026-09-13T14:30:00Z'
  }
];

export const INITIAL_COMMUNITY_GROUPS: CommunityGroup[] = [
  {
    id: 'grp-new-moms',
    name: 'New Mothers Circle',
    slug: 'new-mothers-circle',
    description: 'A gentle, safe haven for mothers navigating the first two years of matrescence and postpartum life.',
    memberCount: 2420,
    postCount: 512,
    icon: 'Baby',
    isJoined: true
  },
  {
    id: 'grp-marriage',
    name: 'Marriage in the Thick of It',
    slug: 'marriage-conversations',
    description: 'Real discussions on communication, emotional intimacy, division of labor, and staying lovers while raising little ones.',
    memberCount: 1890,
    postCount: 380,
    icon: 'Heart',
    isJoined: true
  },
  {
    id: 'grp-toddlers',
    name: 'Conscious Toddler Parenting',
    slug: 'conscious-toddler-parenting',
    description: 'Gentle discipline, nervous system regulation, sensory overwhelm, and handling big emotions.',
    memberCount: 3100,
    postCount: 890,
    icon: 'Sparkles',
    isJoined: false
  },
  {
    id: 'grp-burnout',
    name: 'Maternal Burnout & Restoration',
    slug: 'maternal-burnout-restoration',
    description: 'Somatic grounding, boundary setting, overcoming perfectionism, and recovering your nervous system.',
    memberCount: 2750,
    postCount: 640,
    icon: 'Feather',
    isJoined: false
  }
];

export const INITIAL_COMMUNITY_POSTS: CommunityPost[] = [
  {
    id: 'post-1',
    groupId: 'grp-new-moms',
    groupName: 'New Mothers Circle',
    authorName: 'Toluwanimi A.',
    authorAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=400',
    isAnonymous: false,
    title: 'Did anyone else feel like a stranger in their own body postpartum?',
    content: 'Six months in and looking in the mirror still feels startling. Not just physically, but spiritually. Latisha’s article on Matrescence brought me to tears today because I finally felt seen.',
    createdAt: '2026-09-12T15:00:00Z',
    likesCount: 64,
    commentsCount: 22,
    isLiked: true
  },
  {
    id: 'post-2',
    groupId: 'grp-marriage',
    groupName: 'Marriage in the Thick of It',
    authorName: 'A Tired Mom',
    authorAvatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=400',
    isAnonymous: true,
    title: 'We tried the 6-second kiss rule this week...',
    content: 'We instituted Latisha’s 6-second kiss advice before my partner walked out the door for work. It felt awkward on Monday, but by Thursday we both burst into genuine giggles. Highly recommend!',
    createdAt: '2026-09-13T09:40:00Z',
    likesCount: 89,
    commentsCount: 14,
    isLiked: false
  }
];

export const INITIAL_MENTORS: Mentor[] = [
  {
    id: 'mnt-1',
    name: 'Latisha Langley',
    title: 'Founder, Purpose Mentor & Speaker (@latishalangley)',
    bio: 'Empowering healthy, self-motivated women of God to walk boldly in purpose, balance family and faith, and cultivate mental and physical wholeness.',
    avatarUrl: '/latisha.jpg',
    areasOfSupport: ['Faith & Divine Purpose', 'Healthy Body & Mindset', 'Motherhood & Family Values', 'Self-Motivation & Discipline', 'Sisterhood of Purpose'],
    pricing: '$75 / 45 min',
    rating: 5.0,
    reviewCount: 248,
    sessionTypes: ['1-on-1 Mentorship Call', 'Purpose Alignment Session', 'Spiritual Guidance & Prayer Call']
  },
  {
    id: 'mnt-2',
    name: 'Dr. Evelyn Morales, Ph.D.',
    title: 'Maternal Mental Health Specialist & Advisor',
    bio: 'Clinical psychologist specializing in perinatal emotional regulation, nervous system co-regulation, and boundary resilience.',
    avatarUrl: 'https://images.unsplash.com/photo-1594824813589-325b8495bc27?auto=format&fit=crop&q=80&w=400',
    areasOfSupport: ['Anxiety & Overwhelm', 'Postpartum Mood Adjustments', 'Conscious Parenting Boundaries', 'Motherhood', 'Emotional Healing'],
    pricing: '$95 / 50 min',
    rating: 4.9,
    reviewCount: 96,
    sessionTypes: ['Perinatal Wellness Consultation', 'Parenting Nervous System Workshop']
  },
  {
    id: 'mnt-3',
    name: 'Pastor Maya Jenkins',
    title: 'Spiritual Formation & Prayer Guide',
    bio: 'Dedicated pastor with 15 years guiding women through spiritual dryness, faith transitions, biblical prayer rhythms, and discerning divine calling.',
    avatarUrl: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=400',
    areasOfSupport: ['Deepening Prayer Life', 'Faith & Spiritual Growth', 'Biblical Scripture Rhythms', 'Spiritual Dryness', 'Divine Purpose'],
    pricing: '$65 / 45 min',
    rating: 5.0,
    reviewCount: 142,
    sessionTypes: ['Spiritual Direction Session', 'Prayer & Discernment Hour']
  },
  {
    id: 'mnt-4',
    name: 'Kendra Washington, LMFT',
    title: 'Covenant Marriage & Relationship Counselor',
    bio: 'Licensed marriage and family therapist passionate about helping Christian couples restore communication, balance domestic mental load, and build enduring intimacy.',
    avatarUrl: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&q=80&w=400',
    areasOfSupport: ['Marriage & Communication', 'Couples Alignment', 'Parenting as a Team', 'Emotional Intimacy', 'Family Leadership'],
    pricing: '$110 / 60 min',
    rating: 4.95,
    reviewCount: 118,
    sessionTypes: ['Couples Alignment Session', 'Pre-Marital & Marriage Checkup']
  },
  {
    id: 'mnt-5',
    name: 'Chloe Bennett, M.S., CPT',
    title: 'Holistic Temple Care & Nutritional Wellness Coach',
    bio: 'Certified nutrition specialist guiding Christian women to view their physical health, joyful nutrition, and strength as holy stewardship for God’s kingdom.',
    avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=400',
    areasOfSupport: ['Temple Care & Vitality', 'Healthy Body & Mindset', 'Nourishing Habits', 'Sustainable Energy & Fitness', 'Overcoming Burnout'],
    pricing: '$70 / 45 min',
    rating: 4.9,
    reviewCount: 87,
    sessionTypes: ['Temple Stewardship Audit', 'Personalized Vitality Protocol']
  }
];

export const INITIAL_COURSES: Course[] = [
  {
    id: 'crs-1',
    title: 'Walking in Divine Purpose: The 4-Week Alignment & Resilience Masterclass',
    slug: 'walking-in-divine-purpose-masterclass',
    instructor: 'Latisha Langley',
    description: 'Transform chronic overwhelm into calm spiritual conviction with actionable morning routines, purpose scripts, and healthy temple care.',
    coverImage: 'https://images.unsplash.com/photo-1506126613408-eca07ce68773?auto=format&fit=crop&q=80&w=800',
    thumbnail: 'https://images.unsplash.com/photo-1506126613408-eca07ce68773?auto=format&fit=crop&q=80&w=800',
    duration: '4 Weeks (8 Modules)',
    moduleCount: 8,
    lessonCount: 24,
    lessonsCount: 24,
    category: 'faith-purpose',
    price: '$89',
    enrolledCount: 1420,
    isFree: false,
    progressPercent: 65
  },
  {
    id: 'crs-2',
    title: 'Marriage After Baby: The Communication Playbook for Tired Couples',
    slug: 'marriage-after-baby-playbook',
    instructor: 'Latisha Langley & Guest Mentors',
    description: 'Dismantle resentment, equitably share the invisible mental load, and revive emotional intimacy without demanding hours of free time.',
    coverImage: 'https://images.unsplash.com/photo-1529156069898-49953e39b3ac?auto=format&fit=crop&q=80&w=800',
    thumbnail: 'https://images.unsplash.com/photo-1529156069898-49953e39b3ac?auto=format&fit=crop&q=80&w=800',
    duration: '2 Weeks (4 Modules)',
    moduleCount: 4,
    lessonCount: 12,
    lessonsCount: 12,
    category: 'marriage',
    price: '$69',
    enrolledCount: 890,
    isFree: false,
    progressPercent: 20
  },
  {
    id: 'crs-3',
    title: 'Temple Wholeness: Somatic Nervous System & Faith-Rooted Health',
    slug: 'temple-wholeness-somatic-masterclass',
    instructor: 'Latisha Langley & Dr. Evelyn Morales',
    description: 'Somatic grounding techniques, daily cortisol management, biblical boundary scripts, and restoring vitality to your physical temple.',
    coverImage: 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?auto=format&fit=crop&q=80&w=800',
    thumbnail: 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?auto=format&fit=crop&q=80&w=800',
    duration: '3 Weeks (6 Modules)',
    moduleCount: 6,
    lessonCount: 18,
    lessonsCount: 18,
    category: 'healthy-living',
    price: '$79',
    enrolledCount: 610,
    isFree: false,
    progressPercent: 0
  }
];

export const INITIAL_EVENTS: EventItem[] = [
  {
    id: 'evt-1',
    title: 'Live Workshop: Navigating Holiday Family Boundaries Without Guilt',
    description: 'Interactive live coaching with Latisha Langley on managing in-law expectations, preserving your immediate family peace, and saying no with grace.',
    speaker: 'Latisha Langley',
    date: '2026-10-04',
    time: '18:00',
    timezone: 'WAT / GMT+1',
    type: 'live_session',
    capacity: 250,
    registeredCount: 188,
    price: 'Free for Community Members'
  },
  {
    id: 'evt-2',
    title: 'Mothers Circle: Postpartum Identity & Rediscovering Your Creative Fire',
    description: 'An intimate virtual retreat and circle for mothers of toddlers to share stories, journal, and reflect on personal ambitions.',
    speaker: 'Latisha Langley & Dr. Evelyn Morales',
    date: '2026-10-18',
    time: '15:00',
    timezone: 'WAT / GMT+1',
    type: 'retreat',
    capacity: 40,
    registeredCount: 38,
    price: '$25'
  }
];

export const INITIAL_RESOURCES: ResourceItem[] = [
  {
    id: 'res-1',
    title: 'The Motherhood Emotional Decompression Kit',
    description: 'Printable worksheets, nervous system check-in prompts, and the emergency 5-minute evening grounding guide.',
    category: 'motherhood',
    format: 'PDF Printable',
    fileSize: '3.4 MB',
    downloadCount: 14200
  },
  {
    id: 'res-2',
    title: 'The 10-Minute Marriage Reset Check-In',
    description: 'A gentle Friday evening conversation protocol to discuss mental load, appreciation, and upcoming week planning without arguing.',
    category: 'marriage',
    format: 'PDF Guide + Audio',
    fileSize: '2.1 MB',
    downloadCount: 18500
  },
  {
    id: 'res-3',
    title: 'Boundary Scripts for In-Laws & Extended Family',
    description: '25 exact respectful sentences to protect your nuclear home, holiday visits, unannounced drop-ins, and parenting choices.',
    category: 'relationships',
    format: 'Pocket PDF Guide',
    fileSize: '1.8 MB',
    downloadCount: 22100
  }
];

export const INITIAL_AUDIT_LOGS: AuditLog[] = [
  {
    id: 'log-1',
    timestamp: '2026-09-12T14:00:00Z',
    actorEmail: 'creator@generouslee.life',
    action: 'PUBLISH_QUESTION_RESPONSE',
    targetType: 'Question',
    targetId: 'q-101',
    details: 'Published founder response to question on maternal guilt.'
  },
  {
    id: 'log-2',
    timestamp: '2026-09-10T11:00:00Z',
    actorEmail: 'sarah.editor@generouslee.life',
    action: 'UPDATE_CONTENT',
    targetType: 'Content',
    targetId: 'cnt-1',
    details: 'Updated reading time and SEO description for matrescence article.'
  }
];

export const INITIAL_ANALYTICS: AnalyticsMetric = {
  totalUsers: 14280,
  activeWeeklyUsers: 4890,
  contentViewsTotal: 184500,
  questionsSubmittedTotal: 842,
  questionsAnsweredTotal: 310,
  savedArticlesTotal: 34200,
  communityPostsTotal: 2420,
  conversionFunnel: {
    socialVisitors: 84000,
    websiteReaders: 42500,
    registeredMembers: 14280,
    communityActive: 5800,
    askSubmitted: 842,
    courseEnrolled: 410
  }
};
