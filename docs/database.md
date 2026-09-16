# Database Schema (PostgreSQL 16)

The data model follows strict normalization with foreign keys, timestamps, UUID primary keys, and performance indexes.

```sql
-- 1. USERS & ROLES
CREATE TYPE user_role AS ENUM ('super_admin', 'admin', 'editor', 'moderator', 'mentor', 'contributor', 'user');

CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    name VARCHAR(150) NOT NULL,
    role user_role DEFAULT 'user',
    avatar_url TEXT,
    bio TEXT,
    is_email_verified BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE user_interests (
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    interest VARCHAR(80) NOT NULL,
    PRIMARY KEY (user_id, interest)
);

-- 2. CONTENT CMS
CREATE TYPE content_status AS ENUM ('draft', 'review', 'scheduled', 'published', 'archived');
CREATE TYPE content_type AS ENUM ('article', 'guide', 'story', 'video', 'resource', 'quote', 'tiktok');

CREATE TABLE categories (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(100) NOT NULL,
    slug VARCHAR(120) UNIQUE NOT NULL,
    description TEXT,
    icon_name VARCHAR(50),
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE content (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title VARCHAR(255) NOT NULL,
    slug VARCHAR(280) UNIQUE NOT NULL,
    excerpt TEXT NOT NULL,
    body TEXT NOT NULL,
    cover_image TEXT NOT NULL,
    author_id UUID REFERENCES users(id),
    category_id UUID REFERENCES categories(id),
    content_type content_type DEFAULT 'article',
    status content_status DEFAULT 'draft',
    reading_time_minutes INT DEFAULT 5,
    featured BOOLEAN DEFAULT FALSE,
    view_count INT DEFAULT 0,
    save_count INT DEFAULT 0,
    share_count INT DEFAULT 0,
    published_date TIMESTAMPTZ,
    updated_date TIMESTAMPTZ DEFAULT NOW(),
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE saved_contents (
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    content_id UUID REFERENCES content(id) ON DELETE CASCADE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    PRIMARY KEY (user_id, content_id)
);

-- 3. ASK GENEROUSLEE (QUESTIONS & RESPONSES)
CREATE TYPE question_status AS ENUM ('submitted', 'under_review', 'approved', 'answered', 'published', 'rejected');

CREATE TABLE questions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id) ON DELETE SET NULL,
    author_name VARCHAR(100),
    is_anonymous BOOLEAN DEFAULT TRUE,
    category VARCHAR(80) NOT NULL,
    question_text TEXT NOT NULL,
    context_notes TEXT,
    public_consent BOOLEAN DEFAULT TRUE,
    status question_status DEFAULT 'submitted',
    submitted_at TIMESTAMPTZ DEFAULT NOW(),
    moderated_at TIMESTAMPTZ
);

CREATE TABLE question_responses (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    question_id UUID UNIQUE REFERENCES questions(id) ON DELETE CASCADE,
    responder_id UUID REFERENCES users(id),
    response_text TEXT NOT NULL,
    key_takeaways JSONB DEFAULT '[]'::jsonb,
    answered_at TIMESTAMPTZ DEFAULT NOW(),
    helpful_count INT DEFAULT 0
);

-- 4. AUDIT & ANALYTICS
CREATE TABLE audit_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    actor_email VARCHAR(255) NOT NULL,
    action VARCHAR(100) NOT NULL,
    target_type VARCHAR(60) NOT NULL,
    target_id VARCHAR(100) NOT NULL,
    details TEXT,
    timestamp TIMESTAMPTZ DEFAULT NOW()
);
```
